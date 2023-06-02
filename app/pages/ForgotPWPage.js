import { StatusBar } from 'expo-status-bar';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../config/firebase';

export default function ForgotPWPage() {
  const [email, setEmail] = useState('');

  const errMsg = (title, msg) => Alert.alert(
    title,
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

  const handleForgotPassword = () => {
    if (email === "") {
      errMsg("Error!", "Please ensure no fields are empty!"); 
      return;
    }
    
    sendPasswordResetEmail(auth, email)
    .then(() => { 
      errMsg("", "A password reset link has been sent to your email!");
    })
    .catch((error) => {
      errMsg("Error!", error.code + "\n" + error.message);
      console.log(error.message);
      return;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.image} source={require('../assets/icon.png')} />

      <Text style={styles.main}>
        <Text>Forgot Password?</Text>
      </Text>

      <Text style={styles.line}>
        <Text>Enter your email to reset password.</Text>
      </Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder='Enter your UserID@u.nus.edu'
        />
      </View>

      <TouchableOpacity style={styles.linkButton} onPress={handleForgotPassword}>
        <Text style={styles.linkText}>Send Link</Text>
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
  },

  image: {
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
    height: "40%",
  },

  main: {
    fontSize: 30,
    marginBottom: 20,
  },

  line: {
    marginBottom: 10,
    color: "gray",
  },

  inputView: {
    width: "70%",
    borderRadius: 30,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "#87cdee",
  },

  inputText: {
    height: 50,
    flex: 1,
    textAlign: "center",
  },

  linkButton: {
    width: "70%",
    borderRadius: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: '#094074',
  },

  linkText: {
    color: 'white',
    fontSize: 20,
  },
});