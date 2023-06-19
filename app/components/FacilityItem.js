import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

export default function FacilityItem({ navigation, facilityId, facilityName, 
    groupId, groupName, booking }) {

  const handlePress = () => {
    navigation.navigate('Date', {
      ...booking,
      facilityId: facilityId,
      facilityName: facilityName,
      groupId: groupId,
      groupName: groupName,
    });
  }

  //dynamic rendering of icons depending on which facility is being booked
  const renderIcon = (facilityName) => {
    switch (facilityName) {
      case 'MPH':
        return <Ionicons name="basketball-sharp" size={30} color="black" />;
      case 'MPSH':
        return <Ionicons name="basketball-sharp" size={30} color="black" />;
      case 'Meeting Room':
        return <MaterialIcons name="meeting-room" size={30} color="black" />;
      case 'Study Room':
        return <FontAwesome5 name="door-closed" size={24} color="black" />;
      case 'Gym':
        return <FontAwesome5 name="dumbbell" size={24} color="black" />;
      case 'BBQ Pit':
        return <MaterialIcons name="outdoor-grill" size={24} color="black" />;
      default:
        return null;
    }
  }

  return (
    <TouchableOpacity 
      style={styles.facilityItem}
      onPress={handlePress}>
      <View style={styles.iconContainer}>{renderIcon(facilityName)}</View>
      <Text style={styles.facilityName}>{facilityName}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  facilityItem: {
    backgroundColor: "#EBEBEB",
    width: '95%',
    height: 50,
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "center",
  },

  iconContainer: {
    position: 'absolute',
    left: 10,
  },

  facilityName: {
    color: 'black',
    fontSize: 16,
    textAlign: "left",
    marginLeft: 50,
  },
})