import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FacilitiesPage, DatePage, TimePage } from '../pages';

export default function FacilitiesStack() {
    const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName='Facilities'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Facilities' component={FacilitiesPage} />
      <Stack.Screen name='Date' component={DatePage} />
      <Stack.Screen name='Time' component={TimePage} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})