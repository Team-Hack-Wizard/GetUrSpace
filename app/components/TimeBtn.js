import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function TimeBtn({id, time, selected, onPress}) {
  const handlePress = () => {
      onPress(id);
  }
  // pad 0 to time if time < 10
  time = time < 10 ? "0"+time : time;

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity 
          style={[styles.button, { backgroundColor: selected ? '#094074' : '#E6E6E6' }]} 
          onPress={handlePress}
          disabled={selected}>
        <Text style={[styles.text, { color: selected ? 'white' : 'black' }]}>{time+":00"}</Text>
      </TouchableOpacity> 
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonWrapper: {
    marginHorizontal: 15,
  },
})