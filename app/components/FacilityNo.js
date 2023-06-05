import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function FacilityNo({data}) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{data}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#094074",
    width: '95%',
    height: 40,
    marginVertical: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
    
  text: {
    color: 'white',
    fontSize: 15,
    textAlign: "left",
    marginLeft: 20,
  },
});