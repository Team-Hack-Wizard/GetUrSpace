import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { renderIcon } from "../functions";

export default function AdminFacItem({
  navigation,
  facilityId,
  facilityName,
  groupId,
  groupName,
  number,
}) {
  const handlePress = () => {
    navigation.navigate("Book Facility", {
      facilityId: facilityId,
      facilityName: facilityName,
      groupId: groupId,
      groupName: groupName,
      number: number,
    });
  };

  return (
    <TouchableOpacity style={styles.facilityItem} onPress={handlePress}>
      <View style={styles.iconContainer}>{renderIcon(facilityName)}</View>
      <Text style={styles.facilityName}>{facilityName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  facilityItem: {
    backgroundColor: "#E5E5E5",
    width: "95%",
    height: 50,
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "center",
  },

  iconContainer: {
    position: "absolute",
    left: 10,
  },

  facilityName: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    marginLeft: 50,
  },
});
