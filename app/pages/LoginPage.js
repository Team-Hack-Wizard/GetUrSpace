import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
      console.log('Email', email);
      console.log('Password', password);
      navigation.navigate('Main')
    };

    const login = () => {
      const strongRegex = new RegExp("^[a-zA-Z0-9_.+-]+@u.nus.edu");

      if (!strongRegex.test(email)) {
          showMessage(MESSAGE.email)
          return false;
      }

      if ((!email) || (!password)) {
          showMessage({
            message: "Invalid email or password entered. Try again.",
          })
          return false;
      }
      
      if (password.length < 8) {
          showMessage(MESSAGE.password);
          return false;
      }
    };

    const handleRegister = () => {
      navigation.navigate('Register');
    };

    const handleForgotPassword = () => {
      navigation.navigate('Forgot Password');
    };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require('../assets/icon.png')} />

      <Text style={styles.main}>
        <Text>Log in</Text>
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotButton}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text>New User? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerButton}>Register</Text>
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
    justifyContent: 'center',
  },

  image: {
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
    marginBottom: 20,
    backgroundColor: "#87cdee",
  },

  inputText: {
    height: 50,
    flex: 1,
    textAlign: "center",
  },

  loginButton: {
    width: "70%",
    borderRadius: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: '#094074',
  },

  loginText: {
    color: 'white',
    fontSize: 20,
  },
  
  forgotButton: {
    height: 30,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
  },

  registerButton: {
    fontWeight: "bold",
    color: "red",
  },
});