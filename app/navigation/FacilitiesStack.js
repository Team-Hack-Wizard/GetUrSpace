import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FacilitiesPage, FacilityInfo, DatePage, TimePage } from "../userpages";

export default function FacilitiesStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Facilities"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Facilities" component={FacilitiesPage} />
      <Stack.Screen name="Facility Info" component={FacilityInfo} />
      <Stack.Screen name="Date" component={DatePage} />
      <Stack.Screen name="Time" component={TimePage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
