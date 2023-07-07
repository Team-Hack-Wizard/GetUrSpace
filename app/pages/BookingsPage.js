import { StyleSheet, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  query, collection, where, doc, updateDoc, onSnapshot, deleteDoc, getDoc, orderBy,
  getDocs, Timestamp
} from "firebase/firestore";
import BookingItem from '../components/BookingItem'
import { auth, db } from '../config/firebase'

export default function BookingsPage() {
  // bookings in this format: 
  // [{ id: '1', facility: 'MPH', venue: 'PGPR', date: '8 July', time: '11.30'}, ... ]
  const [bookings, setBookings] = useState([]);

  const handleCancelBooking = async (bookingId, facilityId, facilityNumber, date, time) => {
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
        const facilityBookings = { ...(facilityDoc.data().bookings) };
        facilityBookings[date][time] = (facilityBookings[date][time]).filter((num) => num != facilityNumber);
        updateDoc(facilityRef, {
          "bookings": facilityBookings
        });
      } else {
        console.log("No such facility! Possibilly deleted by admin.");
      }
      await deleteDoc(bookingRef);
    } catch (e) {
      console.log(e);
    }

  };

  // convert time in number to string of HH:00
  const parseTime = (time) => {
    const timeString = time < 10 ? `0${time+1}:00` : `${time+1}:00`;
    return timeString;
  }

  // get bookings from database
  // update bookings state whenever there is a change in the bookings with the user's id
  // [{ id: '1', facility: 'MPH', venue: 'PGPR', date: '8 July', time: '11.30'}, ... ]
  useEffect(() => {
    const q = query(collection(db, "bookings"), where("userId", "==", auth.currentUser.uid),
      orderBy("date"), orderBy("time"), orderBy("facilityName"));
    const moment = require('moment-timezone');
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
            id: doc.id,  // booking id
            facility: data.facilityName,
            facilityId: data.facilityId,
            facilityNumber: data.facilityNumber,
            venue: data.groupName,
            date: data.date,
            time: data.time,
          })
        }

      });
      setBookings(bookings);
    });
    return unsubscribe;

  }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false} decelerationRate={0.2}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.main}>Bookings</Text>
        {bookings.map((booking) => (
          <BookingItem
            key={booking.id}
            id={booking.id}
            facility={booking.facility}
            facilityId={booking.facilityId}
            facilityNumber={booking.facilityNumber}
            venue={booking.venue}
            date={booking.date}
            time={booking.time}
            onCancel={handleCancelBooking}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  main: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
})