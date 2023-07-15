import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import BookingsStack from "./BookingsStack";
import ProfileStack from "./ProfileStack";
import FacilitiesStack from "./FacilitiesStack";

export default function AppStack() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{ tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name="FacilitiesStack"
        component={FacilitiesStack}
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
        name="BookingsStack"
        component={BookingsStack}
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
        name="ProfileStack"
        component={ProfileStack}
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
