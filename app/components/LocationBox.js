import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function LocationBox({ data }) {
  return (
    <View>
      <Text style={styles.text}>{data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#1167B1',
  },
});
