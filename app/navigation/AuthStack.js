import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginPage, RegisterPage, ForgotPWPage } from "../userpages";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Forgot Password" component={ForgotPWPage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
