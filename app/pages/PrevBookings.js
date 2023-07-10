import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
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
import PrevBookingItem from "../components/PrevBookingItem";
import { auth, db } from "../config/firebase";
import { MaterialIcons } from "@expo/vector-icons";

export default function PrevBookings({ navigation }) {
  // bookings in this format:
  // [{ id: '1', facility: 'MPH', venue: 'PGPR', date: '8 July', time: '11.30'}, ... ]
  const [prevBookings, setPrevBookings] = useState([]);

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
    const moment = require("moment-timezone");
    const sgTime = moment().tz("Asia/Singapore").format();
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      let bookings = [];

      // for each booking that has matching userId, add to bookings array with relevent info
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateTime = Date.parse(data.date + "T" + parseTime(data.time));
        // if booking is in the past, delete it from database
        if (dateTime < sgTime) {
          console.log("deleting booking: " + doc.id);
          try {
            deleteDoc(doc.ref);
          } catch (e) {
            console.log(e);
          }
        } else {
          bookings.push({
            id: doc.id, // booking id
            facility: data.facilityName,
            facilityId: data.facilityId,
            facilityNumber: data.facilityNumber,
            venue: data.groupName,
            date: data.date,
            time: data.time,
          });
        }
      });
      setPrevBookings(bookings);
    });
    return unsubscribe;
  }, []);

  const handleReturn = () => {
    navigation.goBack();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} decelerationRate={0.2}>
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <TouchableOpacity onPress={handleReturn}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.main}>Past Bookings</Text>
        </View>
        {prevBookings.map((booking) => (
          <PrevBookingItem
            key={booking.id}
            id={booking.id}
            facility={booking.facility}
            facilityId={booking.facilityId}
            facilityNumber={booking.facilityNumber}
            venue={booking.venue}
            date={booking.date}
            time={booking.time}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  box: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },

  main: {
    fontSize: 30,
    marginHorizontal: 60,
  },
});
