import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BookingItem } from "./BookingItem";

export default function FacilityButton({
  facilityId,
  facilityName,
  groupId,
  groupName,
  number,
  bookings,
}) {
  const [expanded, setExpanded] = useState(false);
  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  const handlePress = () => {

  };

  //dynamic rendering of icons depending on which facility is being booked
  const renderIcon = (facilityName) => {
    switch (facilityName) {
      case "MPH":
        return <Ionicons name="basketball-sharp" size={30} color="black" />;
      case "MPSH":
        return <Ionicons name="basketball-sharp" size={30} color="black" />;
      case "Meeting Room":
        return <MaterialIcons name="meeting-room" size={30} color="black" />;
      case "Study Room":
        return <FontAwesome5 name="door-closed" size={24} color="black" />;
      case "Gym":
        return <FontAwesome5 name="dumbbell" size={24} color="black" />;
      case "BBQ Pit":
        return <MaterialIcons name="outdoor-grill" size={24} color="black" />;
      case "Function Room":
        return (
          <MaterialCommunityIcons name="table-chair" size={24} color="black" />
        );
      default:
        return null;
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.facilityBtn} onPress={handlePress}>
        <View style={styles.iconContainer}>{renderIcon(facilityName)}</View>
        <Text style={styles.facilityName}>{facilityName}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.dropdown}>
          {bookings
            .filter((booking) => booking.facilityId === facilityId)
            .map((booking) => (
                <BookingItem key={booking.id} {...booking} />
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  facilityBtn: {
    backgroundColor: "#EBEBEB",
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

  dropdown: {
    backgroundColor: "#E5E5E5",
    marginTop: 5,
    padding: 10,
  },
});
