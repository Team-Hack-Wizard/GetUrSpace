import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { renderIcon } from "../functions";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function PrevBookingItem({
  id,
  facility,
  facilityId,
  facilityNumber,
  venue,
  date,
  time,
}) {
  // convert time in number to string of HH:00
  const parseTime = (time) => {
    const timeString = time < 10 ? `0${time}:00` : `${time}:00`;
    return timeString;
  };

  return (
    <View>
      <Text>NOT USED</Text>
    </View>
  );
  return (
    <View style={styles.box}>
      <View style={styles.iconContainer}>{renderIcon(facility)}</View>
      <Text style={styles.header}>{facility}</Text>
      <View style={styles.innerBox}>
        <View style={styles.smallBox}>
          <Text style={styles.body}>Venue: {venue}</Text>
          <Text style={styles.body}>Facility Number: {facilityNumber}</Text>
          <Text style={styles.body}>Date: {date}</Text>
          <Text style={styles.body}>Time: {parseTime(time)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#EBEBEB",
    width: "90%",
    marginBottom: 30,
  },

  iconContainer: {
    position: "absolute",
    top: 50,
    left: 15,
  },

  header: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 85,
  },

  innerBox: {
    flexDirection: "row",
    marginLeft: 85,
  },

  smallBox: {
    marginTop: 10,
    marginBottom: 15,
  },

  body: {
    fontSize: 16,
    color: "#7A7A7A",
  },
});
