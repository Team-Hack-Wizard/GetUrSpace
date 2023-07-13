import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminBookingsPage, AdminPrevBookings } from "../adminpages";

export default function AdminBookingsStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Bookings"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Bookings" component={AdminBookingsPage} />
      <Stack.Screen name="Previous Bookings" component={AdminPrevBookings} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});