import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPWPage from '../pages/ForgotPWPage';

export default function AuthNavigator() {
    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: true}}>
        <Stack.Screen name='Login' component={LoginPage} />
        <Stack.Screen name='Register' component={RegisterPage} />
        <Stack.Screen name='Forgot Password' component={ForgotPWPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})
