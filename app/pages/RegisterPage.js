import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase';

export default function RegisterPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [samePassword, confirmPassword] = useState('');

    const handleRegister = () => {
      console.log('User registered!');
      console.log('Email', email);
      console.log('Password', password);
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const register = () => {
      if (email === "" || name === "" || password === "" || samePassword === "") {
        Alert.alert('Invalid details', 'Please ensure no fields are empty!', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ], {cancelable: false});
      }
      createUserWithEmailAndPassword(auth)
    }

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
          onChangeText={text => confirmPassword(text)}
          value={samePassword}
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