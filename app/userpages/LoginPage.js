import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { auth } from "../config/firebase";
import { Feather } from "@expo/vector-icons";
import Msg from "../functions/Msg";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);

  const toggleSecurePassword = () => {
    setSecurePassword(!securePassword);
  }

  const handleLogin = () => {
    if (email === "" || password === "") {
      Msg("Please ensure no fields are empty!");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          if (
            // list of exluded email addresses to bypass email verification
            email !== "test_account@random.com" &&
            email !== "test_account2@random.com" &&
            !userCredential.user.emailVerified
          ) {
            Msg("", "Please verify your email before logging in!");
            auth.signOut();
          }
        })
        .catch((error) => {
          Msg("", error.message);
        });
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleForgotPassword = () => {
    navigation.navigate("Forgot Password");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image style={styles.image} source={require("../assets/icon.png")} />

      <Text style={styles.main}>
        <Text>Log in</Text>
      </Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter your UserID@u.nus.edu"
          selectionColor="red"
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.passwordText}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Enter your password"
          secureTextEntry={securePassword}
          selectionColor="red"
        />
        <TouchableOpacity
          style={styles.passwordIcon}
          onPress={toggleSecurePassword}
        >
          <Feather
            name={securePassword ? "eye" : "eye-off"}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  image: {
    marginTop: 60,
    marginBottom: 10,
    width: "100%",
    height: "35%",
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
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#87cdee",
  },

  inputText: {
    height: 50,
    flex: 1,
    textAlign: "center",
  },

  passwordText: {
    height: 50,
    flex: 1,
    textAlign: "center",
    paddingLeft: 40,
  },

  passwordIcon: {
    padding: 10,
  },

  loginButton: {
    width: "70%",
    borderRadius: 30,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#094074",
  },

  loginText: {
    color: "white",
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
