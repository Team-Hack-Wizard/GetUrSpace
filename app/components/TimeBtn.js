import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function TimeBtn({ id, time, selected, onPress }) {
  const handlePress = () => {
    onPress(id);
  };

  // convert time in number to string of HH:00
  const parseTime = (time) => {
    const timeString = time < 10 ? `0${time}:00` : `${time}:00`;
    return timeString;
  };

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        testID="button"
        style={[
          styles.button,
          { backgroundColor: selected ? "#094074" : "#E6E6E6" },
        ]}
        onPress={handlePress}
        disabled={selected}
      >
        <Text style={[styles.text, { color: selected ? "white" : "black" }]}>
          {parseTime(time)}
        </Text>
      </TouchableOpacity>
    </View>
  );
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
});
