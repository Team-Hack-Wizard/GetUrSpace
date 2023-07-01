import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import NumberDropDown from '../components/NumberDropDown'
import TimeDropDown from '../components/TimeDropDown'

export default function ManageFacilities({ navigation }) {
    const handleReturn = () => {
      navigation.goBack();
    };

    const handleSave = () => {
      navigation.navigate('Facilities');
    };

    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(null);

    const handleTimeSelect = (selectedTime) => {
      setSelectedTime(selectedTime.toString());
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
        <Text style={styles.facInfo}>Facility Info</Text>
      </View>

      <View>
        <Text style={styles.text}>Maximum hours per week</Text>
        <NumberDropDown onSelectNumber={handleNumberSelect}/>
      </View>

      <View>
        <Text style={styles.text}>Book in advance(days)</Text>
        <NumberDropDown onSelectNumber={handleNumberSelect}/>
      </View>

      <View>
        <Text style={styles.text}>Rename Facility</Text>
        <TextInput
          style={styles.input}
          selectionColor="#094074"
        />
      </View>

      <View>
        <Text style={styles.text}>Number of facilities</Text>
        <NumberDropDown onSelectNumber={handleNumberSelect}/>
      </View>

      <View>
        <Text style={styles.text}>First Booking Slot Timing</Text>
        <TimeDropDown onSelectTime={handleTimeSelect}/>
      </View>

      <View>
        <Text style={styles.text}>Last Booking Slot Timing</Text>
        <TimeDropDown onSelectTime={handleTimeSelect}/>
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: 'center',
  },

  facInfo: {
    fontSize: 30,
    marginHorizontal: 70,
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    paddingHorizontal: 20,
  },

  input: {
    width: '90%',
    borderRadius: 10,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 16,
  },

  saveBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: '#094074',
  },

  saveText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})