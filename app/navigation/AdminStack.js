import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AdminFacilities,
  BookFacility,
  FacilitySettings,
  ManageGroupings,
} from "../adminpages";

export default function AdminStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Facilities"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Facilities" component={AdminFacilities} />
      <Stack.Screen name="Book Facility" component={BookFacility} />
      <Stack.Screen name="Facility Settings" component={FacilitySettings} />
      <Stack.Screen name="Manage Groupings" component={ManageGroupings} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
