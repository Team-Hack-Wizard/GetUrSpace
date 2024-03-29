import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  query,
  collection,
  where,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  getDoc,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import BookingItem from "../components/BookingItem";
import { auth, db } from "../config/firebase";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment-timezone";

export default function BookingsPage({ navigation }) {
  // bookings in this format:
  // [{ id: '1', facility: 'MPH', venue: 'PGPR', date: '8 July', time: '11.30'}, ... ]
  const [curBookings, setCurBookings] = useState([]);
  const [prevBookings, setPrevBookings] = useState([]);

  const handleCancelBooking = async (
    bookingId,
    facilityId,
    facilityNumber,
    date,
    time
  ) => {
    try {
      // the onSnapshot listener below will update the bookings state after database is updated
      // so we don't need to update the bookings state here
      // delete booking from database (in both facility and bookings collections)
      const bookingRef = doc(db, "bookings", bookingId);
      const facilityRef = doc(db, "facilities", facilityId);
      // bookings: {date1: {time1: [bookingId1, bookingId2], time2: [...],...},
      //      date2: {time1: [bookingId3, bookingId4], ...}...}
      const facilityDoc = await getDoc(facilityRef);
      if (facilityDoc.exists()) {
        const facilityBookings = { ...facilityDoc.data().bookings };
        facilityBookings[date][time] = facilityBookings[date][time].filter(
          (num) => num != facilityNumber
        );
        updateDoc(facilityRef, {
          bookings: facilityBookings,
        });
      } else {
        console.log("No such facility! Possibly deleted by admin.");
      }
      await deleteDoc(bookingRef);
    } catch (e) {
      console.log(e);
    }
  };

  // convert time in number to string of HH:00
  const parseTime = (time) => {
    const timeString = time < 10 ? `0${time + 1}:00` : `${time + 1}:00`;
    return timeString;
  };

  // get bookings from database
  // update bookings state whenever there is a change in the bookings with the user's id
  // [{ id: '1', facility: 'MPH', venue: 'PGPR', date: '8 July', time: '11.30'}, ... ]
  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("date"),
      orderBy("time"),
      orderBy("facilityName")
    );
    //const moment = require("moment-timezone");
    const sgTime = moment().tz("Asia/Singapore");
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      let curBookings = [];
      let pastBookings = [];

      // for each booking that has matching userId, add to bookings array with relevent info
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateTime = moment(data.date, "YYYY-MM-DD").hour(data.time);
        const booking = {
          id: doc.id, // booking id
          facility: data.facilityName,
          facilityId: data.facilityId,
          facilityNumber: data.facilityNumber,
          venue: data.groupName,
          date: data.date,
          time: data.time,
        };

        // if booking is in the past, move it to the prevBookings page
        if (dateTime.isBefore(sgTime)) {
          pastBookings.push(booking)
        } else {
          curBookings.push(booking);
        }
      });
      setCurBookings(curBookings);
      setPrevBookings(pastBookings);
    });
    return unsubscribe;
  }, []);

  const handlePressPastBooking = () => {
    navigation.navigate("Previous Bookings", { prevBookings: prevBookings });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={styles.main}>Bookings</Text>
        </View>
        <TouchableOpacity onPress={handlePressPastBooking}>
          <AntDesign name="calendar" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={curBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingItem
            key={item.id}
            id={item.id}
            facility={item.facility}
            facilityId={item.facilityId}
            facilityNumber={item.facilityNumber}
            venue={item.venue}
            date={item.date}
            time={item.time}
            onCancel={handleCancelBooking}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No current bookings!</Text>
        )}
        nestedScrollEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  main: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },

  header: {
    marginLeft: 118,
  },

  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "90%",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    color: "#094174",
  },
});
