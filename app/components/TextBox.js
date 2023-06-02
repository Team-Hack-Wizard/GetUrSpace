import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function TextBox({data}) {
    
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{data}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#B1DDF1",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: "center",
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});