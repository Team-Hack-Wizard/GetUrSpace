import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AdminBookingsStack from "./AdminBookingsStack";
import AdminProfile from "../adminpages/AdminProfile";
import AdminStack from "./AdminStack";

export default function AdminAppStack() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{ tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name="AdminStack"
        component={AdminStack}
        initialParams={{ screen: "Facilities" }}
        options={{
          tabBarLabel: "Facilities",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={24} color="#094174" />
            ) : (
              <Ionicons name="home-outline" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="AdminBookingsStack"
        component={AdminBookingsStack}
        initialParams={{ screen: "Bookings" }}
        options={{
          tabBarLabel: "Bookings",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="clockcircle" size={24} color="#094174" />
            ) : (
              <AntDesign name="clockcircleo" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={AdminProfile}
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="#094174" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
