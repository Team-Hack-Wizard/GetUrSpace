import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AdminFacilities from '../adminPages/AdminFacilities';
import AdminBookings from '../adminPages/AdminBookings';
import ManageFacilities from '../adminPages/ManageFacilities';
import ManageGroupings from '../adminPages/ManageGroupings';


export default function AdminStack() {
    const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName='Facilities'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Facilities' component={AdminFacilities}/>
      <Stack.Screen name='Admin Bookings' component={AdminBookings} />
      <Stack.Screen name='Manage Facilities' component={ManageFacilities} />
      <Stack.Screen name='Manage Groupings' component={ManageGroupings} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})