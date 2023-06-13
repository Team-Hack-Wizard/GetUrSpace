import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'

export default function FacilityItem({ navigation, facilityId, facilityName, 
    groupId, booking }) {

  const handlePress = () => {
    navigation.navigate('Date', {
      ...booking,
      facilityId: facilityId,
      groupId: groupId,
    });
  }

  return (
    <TouchableOpacity 
      style={styles.facilityItem}
      onPress={handlePress}>
      <Text style={styles.facilityName}>{facilityName}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  facilityItem: {
    width: '95%',
    height: 50,
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "center",
  },

  facilityName: {
    color: 'black',
    fontSize: 16,
    textAlign: "left",
    marginLeft: 20,
  },
})