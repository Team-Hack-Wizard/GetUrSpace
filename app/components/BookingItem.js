import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

export default function BookingItem({ id, facility, facilityId, facilityNumber, venue,
  date, time, onCancel }) {
  //confirmation message to cancel booking
  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => onCancel(id, facilityId, date, time),
        },
      ],
      { cancelable: false }
    );
  };

  // convert time in number to string of HH:00
  const parseTime = (time) => {
    const timeString = time < 10 ? `0${time}:00` : `${time}:00`;
    return timeString;
  }

  //dynamic rendering of icons depending on which facility is being booked
  const renderIcon = (facility) => {
    switch (facility) {
      case 'MPH':
        return <Ionicons name="basketball-sharp" size={50} color="black" />;
      case 'MPSH':
        return <Ionicons name="basketball-sharp" size={50} color="black" />;
      case 'Meeting Room':
        return <MaterialIcons name="meeting-room" size={50} color="black" />;
      case 'Study Room':
        return <FontAwesome5 name="door-closed" size={50} color="black" />;
      case 'Gym':
        return <FontAwesome5 name="dumbbell" size={50} color="black" />;
      case 'BBQ Pit':
        return <MaterialIcons name="outdoor-grill" size={50} color="black" />;
      default:
        return null;
    }
  }

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
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelBooking}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#EBEBEB',
    width: '90%',
    marginBottom: 30,
  },

  iconContainer: {
    position: 'absolute',
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
    flexDirection: 'row',
    marginLeft: 85,
  },

  smallBox: {
    marginTop: 10,
    marginBottom: 15,
  },

  body: {
    fontSize: 16,
    color: '#7A7A7A',
  },

  cancelBtn: {
    height: 30,
    width: 90,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    marginTop: 45,
    marginLeft: 70,
    alignItems: "center",
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 15,
  },

  cancelText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  }
})