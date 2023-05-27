import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import FacilitiesPage from '../pages/FacilitiesPage';
import BookingsPage from '../pages/BookingsPage';
import ProfilePage from '../pages/ProfilePage';

export default function AppStack() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  return (
    <Tab.Navigator screenOptions={{ tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name='Facilities'
        component={FacilitiesPage}
        initialParams={{ screen: "Facilities" }}
        options={{
          tabBarLabel: 'Facilities',
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ? (
            <Ionicons name="home" size={24} color="#094174" />
          ) : (
            <Ionicons name="home-outline" size={24} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name='Bookings'
        component={BookingsPage}
        options={{
          tabBarLabel: 'Bookings',
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ? (
            <AntDesign name="clockcircle" size={24} color="#094174" />
          ) : (
            <AntDesign name="clockcircleo" size={24} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name='Profile'
        component={ProfilePage}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ? (
            <Ionicons name="person" size={24} color="#094174" />
          ) : (
            <Ionicons name="person-outline" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({})