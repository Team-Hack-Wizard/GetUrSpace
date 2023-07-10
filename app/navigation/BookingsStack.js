import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookingsPage, PrevBookings } from "../pages";

export default function FacilitiesStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Bookings"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Bookings" component={BookingsPage} />
      <Stack.Screen name="Previous Bookings" component={PrevBookings} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
