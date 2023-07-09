import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons'

export default function CalendarDropDown({ selectedDate, onSelectDate }) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleCalendar = () => {
    setModalVisible(!modalVisible);
  };

  // pass the booking date back to the parent component
  const handleDayPress = (day) => {
    onSelectDate(day.dateString);
    toggleCalendar();
  };

  // this ensures that the date always follows the singapore timezone date
  const moment = require('moment-timezone');
  const sgDate = moment().tz("Asia/Singapore").toDate();
  const minDate = sgDate.toISOString().split('T')[0];

  // may want to set the min date for admin booking to be 
  // 1 day after the earliest date that users can book
  // to prevent admin from mass booking the slots have may have contain users' bookings
  return (
    <>
      <TouchableOpacity style={styles.dropdown} onPress={toggleCalendar}>
        <Text style={styles.dropdownText}>
          {selectedDate ? selectedDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleCalendar}>
            <Ionicons name="ios-close" size={32} color="black" />
          </TouchableOpacity>
          <Calendar
            style={styles.calendar}
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDate]: { selected: true },
            }}
            minDate={minDate}
          />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    width: '90%',
    borderRadius: 10,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 16,
  },

  dropdownText: {
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

  calendar: {
    marginTop: 40,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    padding: 10,
  },
})