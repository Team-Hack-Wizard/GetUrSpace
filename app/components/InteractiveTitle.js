import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

export default function InteractiveTitle({ navigation, data }) {
  const handlePress = () => {
    navigation.navigate("Manage Groupings", {
      groupId: data.groupId,
      groupName: data.groupName,
    });
  };

  return (
    <View style={styles.box}>
      <Text testID="title" style={styles.text}>{data && data.groupName? data.groupName: ""}</Text>
      <TouchableOpacity testID="icon" onPress={handlePress} style={styles.iconContainer}>
        <AntDesign name="infocirlceo" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#094074",
    width: "95%",
    height: 40,
    marginVertical: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  text: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    marginLeft: 20,
  },

  iconContainer: {
    marginRight: 20,
  },
});
