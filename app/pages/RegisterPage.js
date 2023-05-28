import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export default function RegisterPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const errMsg = (msg) => Alert.alert(
    "Invalid Detials",
    msg,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ],
    { cancelable: false }
  );

  const handleRegister = () => {
    if (email === "" || password === "" || confirmPassword === "" || name === "") {
      errMsg("Please ensure no fields are empty!");
    } else if (email.length < 10 || email.slice(-10) !== "@u.nus.edu") {
      errMsg("Please register with a valid NUS email!");
    } else if (password !== confirmPassword) {
      errMsg("Passwords do not match!");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          const uid = user.uid;
          setDoc(doc(db, "users", `${uid}`), {
            email: email,
            name: name,
            group: [1]
          });
        })
        .then(() => {
          sendEmailVerification(auth.currentUser);
          alert("Verification email has been sent, please verify your email before logging in!");
          navigation.navigate('Login');
        })
        .then(() => {
          if (! auth.currentUser.emailVerified) {
            auth.signOut();
          }
        }).catch((error) => {
          errMsg(error.message);
          console.log(error.message);
        });
    }
  }

  const handleLogin = () => {
    navigation.navigate('Login');
  };



  return (
    <View style={styles.container}>
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
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setName(text)}
          value={name}
          placeholder='Enter your name'
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setPassword(text)}
          value={password}
          placeholder='Enter your password'
          secureTextEntry={true}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          placeholder='Confirm your password'
          secureTextEntry={true}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  image: {
    marginTop: 40,
    marginBottom: 10,
    width: '100%',
    height: "40%",
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
    // marginTop: 10,
  },

  loginButton: {
    fontWeight: "bold",
    color: "red",
  },
});