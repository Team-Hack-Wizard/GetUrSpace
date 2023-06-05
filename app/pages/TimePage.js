import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import TimeBtn from '../components/TimeBtn'
import FacilityNo from '../components/FacilityNo';

export default function TimePage({ navigation }) {
    const [selected, setSelected] = useState('');

    const handleReturn = () => {
      navigation.navigate('Date');
    };

    const handleBook = () => {
      navigation.navigate('Facilities', {resetSelection: true});
    };

    const handlePress = (id) => {
      setSelected(id);
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.selectTime}>Select Time</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <FacilityNo data="Facility 1"/>
          <View style={styles.row}>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={1} time="08:00AM" selected={selected === 1} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={2} time="10:00AM" selected={selected === 2} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={3} time="12:00PM" selected={selected === 3} onPress={handlePress} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={4} time="14:00PM" selected={selected === 4} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={5} time="16:00PM" selected={selected === 5} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={6} time="18:00PM" selected={selected === 6} onPress={handlePress} />
            </View>
          </View>
        </View>

        <View>
          <FacilityNo data="Facility 2"/>
          <View style={styles.row}>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={7} time="08:00AM" selected={selected === 7} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={8} time="10:00AM" selected={selected === 8} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={9} time="12:00PM" selected={selected === 9} onPress={handlePress} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={10} time="14:00PM" selected={selected === 10} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={11} time="16:00PM" selected={selected === 11} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={12} time="18:00PM" selected={selected === 12} onPress={handlePress} />
            </View>
          </View>
        </View>

        <View>
          <FacilityNo data="Facility 3"/>
          <View style={styles.row}>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={13} time="08:00AM" selected={selected === 13} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={14} time="10:00AM" selected={selected === 14} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={15} time="12:00PM" selected={selected === 15} onPress={handlePress} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={16} time="14:00PM" selected={selected === 16} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={17} time="16:00PM" selected={selected === 17} onPress={handlePress} />
            </View>
            <View style={styles.buttonWrapper}>
              <TimeBtn id={18} time="18:00PM" selected={selected === 18} onPress={handlePress} />
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.bookNowBtn} onPress={handleBook} disabled={!selected}>
        <Text style={styles.bookNowText}>Book Now</Text>
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

  main:{
    marginVertical: 20,
    alignItems: "center",
    flexDirection: "row",
  },

  selectTime: {
    fontSize: 30,
    marginHorizontal: 80,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  buttonWrapper: {
    marginHorizontal: 15,
  },

  bookNowBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 75,
    marginBottom: 30,
    backgroundColor: '#094074',
  },

  bookNowText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})