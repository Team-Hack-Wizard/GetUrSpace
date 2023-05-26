import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export default function RegisterPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (email === "" || password === "" || phone === "") {
      errMsg("Please fill in all the fields!");
    } else if (email.length < 10 || email.slice(-10) !== "@u.nus.edu"){
      errMsg("Please register a valid NUS email!");
    } else if (password !== confirmPassword) {
      errMsg("Passwords do not match!");
    } else {
      createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
        const user = userCredentials._tokenResponse.email;
        const uid = auth.currentUser.uid;
        setDoc(doc(db, "users", `${uid}`), {
          email: user,
          phone: phone
        })
      }).catch((error) => { console.log(error); });

      navigation.navigate('Login')
    }
  }

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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
    marginBottom: 20,
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
    marginVertical: 15,
    backgroundColor: '#0f52ba',
  },

  registerText: {
    color: 'white',
    fontSize: 20,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
  },

  loginButton: {
    fontWeight: "bold",
    color: "red",
  },
});