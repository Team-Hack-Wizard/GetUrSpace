import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet, Text, TextInput, View, Image, TouchableOpacity, 
  Alert, KeyboardAvoidingView 
} from 'react-native';
import { setDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword, deleteUser, sendEmailVerification, updateProfile
} from 'firebase/auth';
import { auth, db } from '../config';

const DEFAULT_GROUP_IDS = ["S3Y8U7GJXnRmTyVeDBAX"];
// get group info on the default groups, to pass in to the groups under newly createduser document
async function getDefaultGroups() {
  let defaultGroups = [];
  for (const groupId of DEFAULT_GROUP_IDS) {
    let curGroup = {};
    const groupSnap = await getDoc(doc(db, "groups", groupId));
    if (! groupSnap.exists()) {
      console.log("No such document!");
      continue;
    } 
    curGroup.groupId = groupId;
    curGroup.groupName = await groupSnap.get("name");
    const facilityIds = await groupSnap.get("facilities");
    let facilities = [];
    for (const facilityId of facilityIds) {
      const facilitySnap = await getDoc(doc(db, "facilities", facilityId));
      if (! facilitySnap.exists()) {
        console.log("No such document!");
        continue;
      } 
      facilities.push({
        facilityId: facilityId,
        facilityName: await facilitySnap.get("name"),
      });
    }
    curGroup.facilities = facilities;
    defaultGroups.push(curGroup);
  }
  return defaultGroups;
}

export default function RegisterPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const errMsg = (msg) => Alert.alert(
    "Invalid Details",
    msg,
    [
      {
        text: "Cancel",
        //onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK" }
    ],
    { cancelable: false }
  );

  const handleRegister = async () => {
    if (email === "" || password === "" || confirmPassword === "" || name === "") {
      errMsg("Please ensure no fields are empty!");
    } else if (email.length < 10 || email.slice(-10) !== "@u.nus.edu") {
      errMsg("Please register with a valid NUS email!");
    } else if (password !== confirmPassword) {
      errMsg("Passwords do not match!");
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredentials) => {
          const user = userCredentials.user;
          const uid = user.uid;
          await setDoc(doc(db, "users", uid), {
            email: email,
            name: name,
            // everyone added to default groups
            groups: await getDefaultGroups(),
          });
          return user;
        })
        .then(async (user) => {
          await updateProfile(user, {
            displayName: name
          });
          console.log(user);
          sendEmailVerification(user)
        })

        // update users in each default group
        for (const groupId of DEFAULT_GROUP_IDS) {
          const groupRef = doc(db, "groups", groupId);
          updateDoc(groupRef, {
            users: arrayUnion(auth.currentUser.uid)
          });
        }

        alert("Verification email has been sent, please verify your email before logging in!");
        navigation.navigate('Login');
        if (auth.currentUser && !auth.currentUser.emailVerified) {
          console.log("User is signed in, signing out...")
          auth.signOut();
        }
      } catch (error) {
        errMsg(error.message);
        console.log(error.code);
        console.log(error.message);
        deleteUser(auth.currentUser).catch((error) => {
          console.log("Error deleting user")
          console.log(error.code);
          console.log(error.message);
        });
      };

    }
  }

  const handleLogin = () => {
    navigation.navigate('Login');
  };



  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <Image style={styles.image} source={require('../assets/icon.png')} />

      <Text style={styles.main}>
        <Text>Register</Text>
      </Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder='Enter your UserID@u.nus.edu'
          selectionColor='red'
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setName(text)}
          value={name}
          placeholder='Enter your name'
          selectionColor='red'
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setPassword(text)}
          value={password}
          placeholder='Enter your password'
          secureTextEntry={true}
          selectionColor='red'
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          placeholder='Confirm your password'
          secureTextEntry={true}
          selectionColor='red'
        />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>Existing User? </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  image: {
    marginTop: 60,
    marginBottom: 10,
    width: '100%',
    height: "35%",
  },

  main: {
    fontSize: 30,
    marginBottom: 15,
  },

  inputView: {
    width: "70%",
    borderRadius: 30,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#87cdee",
  },

  inputText: {
    height: 50,
    flex: 1,
    textAlign: "center",
  },

  registerButton: {
    width: "70%",
    borderRadius: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: '#094074',
  },

  registerText: {
    color: 'white',
    fontSize: 20,
  },

  row: {
    flexDirection: "row",
  },

  loginButton: {
    fontWeight: "bold",
    color: "red",
  },
});