import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { Msg, renderIcon } from "../functions";

export default function BookingItem({
  id,
  facility,
  facilityId,
  facilityNumber,
  venue,
  date,
  time,
  userEmail,
  onCancel,
}) {
  //confirmation message to cancel booking
  const handleCancelBooking = () => {
    Msg(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      () => onCancel(id, facilityId, facilityNumber, date, time)
    );
  };

  // convert time in number to string of HH:00
  const parseTime = (time) => {
    const timeString = time < 10 ? `0${time}:00` : `${time}:00`;
    return timeString;
  };

  return (
    <View style={styles.box}>
      {facility && (
        <View style={styles.iconContainer}>{renderIcon(facility)}</View>
      )}
      {facility && <Text style={styles.header}>{facility}</Text>}
      <View style={styles.innerBox}>
        <View style={styles.smallBox}>
          {venue && <Text style={styles.body}>Venue: {venue}</Text>}
          {userEmail && (
            <Text style={styles.body}>User Email: {userEmail}</Text>
          )}
          <Text style={styles.body}>Facility Number: {facilityNumber}</Text>
          <Text style={styles.body}>Date: {date}</Text>
          <Text style={styles.body}>Time: {parseTime(time)}</Text>
        </View>
        {onCancel && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancelBooking}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#B1DDF1",
    width: "90%",
    marginVertical: 15,
    alignSelf: "center",
  },

  iconContainer: {
    position: "absolute",
    top: 55,
    left: 20,
  },

  header: {
    fontSize: 18,
    marginTop: 10,
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

  cancelBtn: {
    height: 30,
    width: 90,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "black",
    marginTop: 45,
    marginLeft: 70,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 15,
    right: 15,
  },

  cancelText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
});
