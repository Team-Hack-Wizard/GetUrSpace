import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import FacilitiesPage from './pages/FacilitiesPage';
import { Ionicons } from '@expo/vector-icons';
import BookingsPage from './pages/BookingsPage';
import { AntDesign } from '@expo/vector-icons';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPWPage from './pages/ForgotPWPage';

export default function StackNavigator() {
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    function BottomTabs() {
      return (
        <Tab.Navigator screenOptions={{tabBarHideOnKeyboard: true}}>
          <Tab.Screen 
            name='Facilities' 
            component={FacilitiesPage}
            initialParams={{ screen: "Facilities" }}
            options={{
              tabBarLabel:'Facilities', 
              headerShown:false, 
              tabBarIcon:({focused}) => focused ? (
                  <Ionicons name="home" size={24} color="094174" />
              ) : (
                  <Ionicons name="home-outline" size={24} color="black" />
              ),}}
          />

          <Tab.Screen 
            name='Bookings' 
            component={BookingsPage} 
            options={{
              tabBarLabel:'Bookings', 
              headerShown:false, 
              tabBarIcon:({focused}) => focused ? (
                  <AntDesign name="clockcircle" size={24} color="094174" />
              ) : (
                  <AntDesign name="clockcircleo" size={24} color="black" />
              ),}}
          />

          <Tab.Screen 
            name='Profile' 
            component={ProfilePage} 
            options={{
              tabBarLabel:'Profile', 
              headerShown:false, 
              tabBarIcon:({focused}) => focused ? (
                  <Ionicons name="person" size={24} color="094174" />
              ) : (
                  <Ionicons name="person-outline" size={24} color="black" />
              ),}}
          />
        </Tab.Navigator>
      );
    }

    function MainStack() {
      return (
        <Stack.Navigator>
          <Stack.Screen name='Login' component={LoginPage}/>
          <Stack.Screen name='Register' component={RegisterPage}/>
          <Stack.Screen name='Forgot Password' component={ForgotPWPage}/>
          <Stack.Screen name="Main" component={BottomTabs} options={{headerShown:false}}/>
        </Stack.Navigator>
      );
    }
    
    return (
      <NavigationContainer>
        <MainStack/>
      </NavigationContainer>
    )
}

const styles = StyleSheet.create({})