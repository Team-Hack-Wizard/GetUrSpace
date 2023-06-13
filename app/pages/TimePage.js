import {
  Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,
  ActivityIndicator
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import TimeBtn from '../components/TimeBtn'
import FacilityNo from '../components/FacilityNo';
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
  // bookings stores the list of bookings for the facility on the date (stored in curBooking)
  const [bookings, setBookings] = useState([]);
  // available stores the list of available timings for the facility on the date
  // format: [[8,9,10], [...], ...] where ith array is the available timings for the ith facility
  const [available, setAvailable] = useState([]);
  const curBooking = route.params;
  // object of booking: {
  //   userId: auth.currentUser.uid,
  //   facilityId: FilLED IN BY FACILITIES PAGE,
  //   groupId: FILLED IN BY FACILITIES PAGE,
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
        // bookingIds is in the format {
        //  date: [bookingId1, bookingId2, ...],
        //  date2: [bookingId3, bookingId4, ...], ....
        // }
        const bookingIds = { ...facilityDoc.data().bookings };
        if (!bookingIds[newBooking.date]) {
          bookingIds[newBooking.date] = [bookingRef.id];
        } else {
          bookingIds[newBooking.date] = [...(bookingIds[newBooking.date]), bookingRef.id];
        }
        if (!facilityDoc.exists()) {
          throw "Unknown error, this facility does not exist!";
        }
        // check if the booking slot has already been taken by searching 
        // for the same booking details in the bookings collection
        const q = query(collection(db, "bookings"), where("facilityId", "==", newBooking.facilityId),
          where("date", "==", newBooking.date), where("time", "==", newBooking.time),
          where("facilityNumber", "==", newBooking.facilityNumber));
        const snapShot = await getDocs(q);
        // there should only be 0 or 1 booking from the query
        if (snapShot.docs.length > 0) {
          throw "This booking slot has already been taken!";
        } else {
          transaction.set(bookingRef, newBooking);
          transaction.update(facilityRef, {
            bookings: bookingIds
          });
        }
      });
      console.log("Transaction successfully committed!");
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
      if (newBookings) setBookings(newBookings);
    });
    return unsubscribe;
  }, []);

  // Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP, etc.)
  // inclusive of start and stop
  const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

  // on changes to bookings, update the available timings
  useEffect(() => {
    if (! loading) setLoading(true);
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
      const timeArr = range(facility.startTime, facility.endTime, TIMEINTERVAL);
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

        <ScrollView showsVerticalScrollIndicator={false}>
          {available.map((timeArr, index1) => (
              <View key={index1}>
                <FacilityNo data={"Facility " + (index1 + 1)} />
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
  },

  bookNowBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 75,
    marginBottom: 30,
  },

  bookNowText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})