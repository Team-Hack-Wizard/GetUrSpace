import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfilePage, FAQ } from "../userpages";

export default function ProfileStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="FAQ" component={FAQ} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
