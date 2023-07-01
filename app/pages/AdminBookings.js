import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import CalendarDropDown from '../components/CalendarDropDown'
import NumberDropDown from '../components/NumberDropDown'
import TimeDropDown from '../components/TimeDropDown'

export default function AdminBookings({ navigation }) {
    const handleReturn = () => {
      navigation.goBack();
    };

    const handleSettings = () => {
      navigation.navigate('Manage Facilities');
    };

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(null);

    const handleFromDateSelect = (selectedDate) => {
      setFromDate(selectedDate);
    };
  
    const handleToDateSelect = (selectedDate) => {
      if (fromDate && selectedDate >= fromDate) {
        setToDate(selectedDate);
      } else {
        // Show an error message or handle the invalid selection here
        Alert.alert(
          'Invalid Date',
          `Please choose a date later than ${fromDate}.`,
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      }
    };

    const handleFromTimeSelect = (selectedTime) => {
      setFromTime(selectedTime.toString());
    };

    const handleToTimeSelect = (selectedTime) => {
      if (fromDate === toDate && selectedTime < fromTime) {
        // Show an error message or handle the invalid selection here
        Alert.alert(
          'Invalid Date',
          `Please choose a time later than ${fromTime}.`,
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      } else {
        setToTime(selectedTime.toString())
      }
    };

    const handleNumberSelect = (selectedNumber) => {
      setSelectedNumber(selectedNumber.toString());
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.bookFac}>Book Facility</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="ios-settings" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.text}>From Date:</Text>
        <CalendarDropDown 
          selectedDate={fromDate}
          onSelectDate={handleFromDateSelect}
        />
      </View>

      <View>
        <Text style={styles.text}>To Date:</Text>
        <CalendarDropDown 
          selectedDate={toDate}
          onSelectDate={handleToDateSelect}
        />
      </View>

      <View>
        <Text style={styles.text}>From Time:</Text>
        <TimeDropDown onSelectTime={handleFromTimeSelect}/>
      </View>

      <View>
        <Text style={styles.text}>To Time:</Text>
        <TimeDropDown onSelectTime={handleToTimeSelect}/>
      </View>

      <View>
        <Text style={styles.text}>Facility Number</Text>
        <NumberDropDown onSelectNumber={handleNumberSelect}/>
      </View>

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={handleReturn}>
        <Text style={styles.bookText}>Book</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  main: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    paddingHorizontal: 20,
  },

  bookFac: {
    fontSize: 30,
    marginHorizontal: 50,
  },

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

  bookBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 120,
    backgroundColor: '#094074',
  },

  bookText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})