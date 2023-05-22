import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FacilitiesPage from './pages/FacilitiesPage';
import { Ionicons } from '@expo/vector-icons';
import BookingsPage from './pages/BookingsPage';
import { FontAwesome } from '@expo/vector-icons';
import ProfilePage from './pages/ProfilePage';
import { NavigationContainer } from '@react-navigation/native';

const StackNavigator = () => {
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    function BottomTabs() {
        return (
          <Tab.Navigator>
            <Tab.Screen 
              name='Facilities' 
              component={FacilitiesPage} 
              options={{
                tabBarLabel:'Facilities', 
                headerShown:false, 
                tabBarIcon:({focused}) => focused ? (
                  <Ionicons name="home" size={24} color="0f52ba" />
                ) : (
                  <Ionicons name="home-outline" size={24} color="black" />
                )}}
            />

            <Tab.Screen 
              name='Bookings' 
              component={BookingsPage} 
              options={{
                tabBarLabel:'Bookings', 
                headerShown:false, 
                tabBarIcon:({focused}) => focused ? (
                  <FontAwesome name="bookmark" size={24} color="0f52ba" />
                ) : (
                  <FontAwesome name="bookmark-o" size={24} color="black" />
                )}}
            />

            <Tab.Screen 
              name='Profile' 
              component={ProfilePage} 
              options={{
                tabBarLabel:'Profile', 
                headerShown:false, 
                tabBarIcon:({focused}) => focused ? (
                  <Ionicons name="person" size={24} color="0f52ba" />
                ) : (
                  <Ionicons name="person-outline" size={24} color="black" />
                )}}
            />
            </Tab.Navigator>
        )
    }
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={BottomTabs} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})