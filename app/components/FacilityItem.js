import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'

export default function FacilityItem({ name, navigation, selected, setSelected }) {

    const handlePress = () => {
      setSelected(!selected);
      navigation.navigate('Date');
    }

    useEffect(() => {
      setSelected(false);
    }, [name]);

  return (
    <TouchableOpacity 
      style={[styles.facilityItem, {backgroundColor: selected ? "#B1DDF1" : "#EBEBEB" }]}
      onPress={handlePress}>
      <Text style={styles.facilityName}>{name}</Text>
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