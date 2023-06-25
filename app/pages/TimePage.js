import {
  Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,
  ActivityIndicator
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import TimeBtn from '../components/TimeBtn'
import Title from '../components/Title';
import { db } from '../config/firebase';
import {
  collection, query, where, doc, onSnapshot, getDoc, getDocs,
  orderBy, runTransaction, deleteDoc
} from "firebase/firestore";

const TIMEINTERVAL = 1; // in hours

export default function TimePage({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  // selected is in the format "i j" where i is the facility number(0 indexing) and j is the time index
  const [selected, setSelected] = useState(-1);
  // bookings stores the list of bookings for the facility on the date (that is stored in curBooking)
  const [bookings, setBookings] = useState([]);
  // available stores the list of available timings for the facility on the date
  // format: [[8,9,10], [...], ...] where ith array is the available timings for the ith facility
  const [available, setAvailable] = useState([]);
  const curBooking = route.params;
  // object of booking: {
  //   userId: auth.currentUser.uid,
  //   facilityId: FilLED IN BY FACILITIES PAGE,
  //   facilityName: FILLED IN BY FACILITIES PAGE,
  //   groupId: FILLED IN BY FACILITIES PAGE,
  //   groupName: FILLED IN BY FACILITIES PAGE,
  //   date: FILLED IN BY DATE PAGE,
  //   time: '',
  //   facilityNumber: 0,
  // };

  const errMsg = (title, msg) => Alert.alert(
    title, msg,
    [
      {
        text: "Cancel",
        //onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK" }
    ],
    { cancelable: false }
  );

  const handleReturn = () => {
    navigation.navigate('Date', curBooking);
    // pass the booking data back to the date page, though Date should still
    // have the booking data from the previous page
  };

  // Use transactions to write booking into firestore to prevent race conditions
  const handleBook = async () => {
    let newBooking = { ...curBooking };
    selectedValue = selected.split(" ");
    newBooking.time = parseInt(available[selectedValue[0]][selectedValue[1]]);
    newBooking.facilityNumber = parseInt(selected.charAt(0)) + 1;
    // empty doc ref to be used later for transaction writing
    const bookingRef = doc(collection(db, "bookings"));
    try {
      const facilityRef = doc(db, "facilities", newBooking.facilityId);
      await runTransaction(db, async (transaction) => {
        const facilityDoc = await transaction.get(facilityRef);
        if (!facilityDoc.exists()) {
          throw "Unknown error, this facility does not exist!";
        }
        // bookingIds is in the format {
        //  date: { time1: [facilityNum1, facilityNum2, ...], time2: [...], ...},
        //  date2: {time3: [facilityNum3, facilityNum4, ...]}, ....
        // }
        // create the new booking object to update into the bookings field of facility
        const bookingIds = { ...(facilityDoc.data().bookings)};
        // check if the booking slot has already been taken by searching 
        // for the same booking details in the bookings collection
        if (!bookingIds[newBooking.date]) {
          // if the date is not in the bookings field, create a new object
          // then add the booking id to the array of date: {time: []}
          bookingIds[newBooking.date] = {};
          bookingIds[newBooking.date][newBooking.time] = [newBooking.facilityNumber];
        } else if (!bookingIds[newBooking.date][newBooking.time]) {
          // if the time is not in the bookings field, create a new array with the booking id
          bookingIds[newBooking.date][newBooking.time] = [newBooking.facilityNumber];
        } else if (!bookingIds[newBooking.date][newBooking.time].includes(newBooking.facilityNumber)) {
          // if the facilityNumber is not in the array, add it to the array of bookings
          bookingIds[newBooking.date][newBooking.time].push(newBooking.facilityNumber);
        } else {
          // It must then be the case that the booking id is already in the array, 
          // the slot has been taken
          throw "This booking slot has already been taken!";
        }

        transaction.set(bookingRef, newBooking);
        transaction.update(facilityRef, {
          bookings: bookingIds
        });
      });
      errMsg("Success", "Your booking is successful! You can view it at the bookings page.");
      navigation.navigate('Facilities');
    } catch (e) {
      console.log("Transaction failed: ", e);
      errMsg("Error", "Transaction failed: " + e + " Please try again later!");
      // if there is any error, we will delete that booking
      await deleteDoc(bookingRef);
      setSelected(-1);  // reset selected and it should refresh the page
    }

  };

  const handlePress = (id) => {
    setSelected(id);
  };

  // listens to any changes to the bookings for the facility on the date
  useEffect(() => {
    const q = query(collection(db, "bookings"), where("facilityId", "==", curBooking.facilityId),
      where("date", "==", curBooking.date), orderBy("time"));
    const unsubscribe = onSnapshot(q, async (snapShot) => {
      let newBookings = await Promise.all(snapShot.docs.map(doc => doc.data()));
      setBookings(newBookings);
    });
    return unsubscribe;
  }, []);

  // Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP, etc.)
  // inclusive of start and stop
  const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

  // on changes to bookings, update the available timings
  useEffect(() => {
    if (!loading) setLoading(true);
    const moment = require('moment-timezone');
    const sgDate = moment().tz("Asia/Singapore").format("YYYY-MM-DD");
    const sgHour = moment().tz("Asia/Singapore").hours();
    let newAvailable = [];
    let facility = {};
    // get the number of facilities
    async function getFacility() {
      const docRef = doc(db, "facilities", curBooking.facilityId);
      const docSnap = await getDoc(docRef);
      facility = { ...docSnap.data() };
      /////////////// some error handling for facility data ///////////////
      if (typeof facility.startTime === "string") {
        facility.startTime = Number(facility.startTime.split(":")[0]);
        console.log("facitlity start time not a number, facilityId: ", curBooking.facilityId);
      }
      if (typeof facility.endTime === "string") {
        facility.endTime = Number(facility.endTime.split(":")[0]);
        console.log("facitlity end time not a number, facilityId: ", curBooking.facilityId);
      }
      if (typeof facility.number !== "number") {
        facility.number = Number(facility.number);
        console.log("facitlity number not a number type, facilityId: ", curBooking.facilityId);
      }
      /////////////////////////////////////////////////////////////////////
      // if user is booking for today, the minTime is the current hour
      const minTime = (curBooking.date == sgDate ? 
        Math.max(sgHour, facility.startTime) : facility.startTime);
      const timeArr = range(minTime, facility.endTime, TIMEINTERVAL);
      // duplicate the array for the number of facilities
      for (let i = 0; i < facility.number; i++) {
        newAvailable.push([...timeArr]);
      }
      // remove the timings that are already booked
      for (const booking of bookings) {
        const { time, facilityNumber } = booking;
        // mark the time slot in the array as booked (with -1)
        try {
          newAvailable[(facilityNumber - 1)][(time - facility.startTime)] = -1;
        } catch (e) {
          console.log("error in marking booked time as booked: ", e);
          console.log("booking: ", booking);
          console.log("facilityNumber = ", (facilityNumber));
          console.log("facilityNumber - 1 = ", (facilityNumber - 1));
          console.log("time - facility.startTime = ", time - facility.startTime);
        }
      }
      // filter out the booked timings marked as -1 and save it in available state
      setAvailable(newAvailable.map(arr => arr.filter(time => time !== -1)));
      setLoading(false);
    }
    getFacility();
  }, [bookings]);


  if (loading === true) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <TouchableOpacity onPress={handleReturn}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.selectTime}>Select Time</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <TouchableOpacity onPress={handleReturn}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.selectTime}>Select Time</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} decelerationRate={0.2}>
          {available.map((timeArr, index1) => (
            <View key={index1}>
              <Title data={"Facility " + (index1 + 1)} />
              <View style={styles.buttonGroup}>
                {timeArr.map((time, index2) => (
                  <TimeBtn
                    key={`${index1} ${index2}`}
                    id={`${index1} ${index2}`}
                    time={time}
                    selected={selected === `${index1} ${index2}`}
                    onPress={handlePress}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.bookNowBtn, { backgroundColor: selected === -1 ? '#E6E6E6' : '#094074' }]}
          onPress={handleBook}
          disabled={selected === -1}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>

      </SafeAreaView>
    )

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  main: {
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

  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    marginHorizontal: 10,
  },

  bookNowBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  bookNowText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})