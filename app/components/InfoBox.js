import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function InfoBox({ data }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "90%",
    borderRadius: 10,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 16,
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
