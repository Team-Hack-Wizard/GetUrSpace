import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Email', email);
        console.log('Password', password);
    };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require('../assets/icon.png')} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder='Enter your UserID@u.nus.edu'
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          onChangeText={text => setPassword(text)}
          value={password}
          placeholder='Enter your password'
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotButton}>Forgot Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

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
    marginBottom: 40,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },

  inputView: {
    backgroundColor: "#87cdee",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  input: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgotButton: {
    height: 30,
    marginBottom: 30,
  },

  loginButton: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    backgroundColor: '#0f52ba',
  },

  loginText: {
    color: 'white',
    fontSize: 20,
  },
});