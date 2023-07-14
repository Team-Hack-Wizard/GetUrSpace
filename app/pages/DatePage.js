import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';

export default function DatePage({ navigation, route }) {
  const booking = route.params;
  const [selectedDate, setSelectedDate] = useState('');

  const handleContinue = () => {
    navigation.navigate('Time', {
      ...booking,
      date: selectedDate,
    });
    // pass down booking info to the next page
  };

  const handleReturn = () => {
    navigation.navigate('Facilities');
  }

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    // dataString is in the format YYYY-MM-DD
  };

  const isContinueDisabled = selectedDate === '';

  // this ensures that the date always follows the singapore timezone date
  const moment = require('moment-timezone');
  const sgDate = moment().tz("Asia/Singapore").toDate();
  const minDate = sgDate.toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.selectDate}>
          <Text>Select Date</Text>
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          onDayPress={handleDayPress}
          markedDates={{ [selectedDate]: { selected: true, disableTouchEvent: true } }}
          minDate={minDate}
        />
      </View>

      <TouchableOpacity
        style={[styles.continueBtn, { backgroundColor: isContinueDisabled ? '#E6E6E6' : '#094074' }]}
        onPress={handleContinue}
        disabled={isContinueDisabled}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  main: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },

  selectDate: {
    fontSize: 30,
    marginHorizontal: 80,
  },

  calendarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
  },

  calendar: {
    aspectRatio: 1.2,
    // justifyContent: "flex-start",
    // marginVertical: 50,
    width: "100%",
  },

  continueBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 120,
    backgroundColor: '#094074',
  },

  continueText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})