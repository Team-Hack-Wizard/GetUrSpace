import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { renderIcon } from "../functions";
import BookingItem from "./BookingItem";
import {
  collection,
  doc,
  onSnapshot,
  where,
  orderBy,
  query,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Msg from "../functions/Msg";
import moment from "moment-timezone";

// facility button receives bookings array where each booking is an object of booking info
// eg: [{facilityId: , facilityName: , groupId: , groupName: ,
// bookings: [{date: , time: , facilityNumber: , userId: , bookingId: },...]}, ... ]
export default function FacilityButton({ facilityId, facilityName, searchQuery }) {
  const [expanded, setExpanded] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) setLoading(true);
    const sgTime = moment().tz("Asia/Singapore");
    const bookingQuery = query(
      collection(db, "bookings"),
      where("facilityId", "==", facilityId),
      where("date", ">=", sgTime.format("YYYY-MM-DD")),
      orderBy("date"),
      orderBy("time")
    );
    const unsubscribe = onSnapshot(bookingQuery, (querySnapshot) => {
      let newBookings = [];
      querySnapshot.forEach((bookingDoc) => {
        const booking = bookingDoc.data();
        const date = booking.date;
        const time = booking.time;
        const bookingTime = moment(date).hour(time);
        // ensure that this is a future booking
        if (bookingTime.isAfter(sgTime)) {
          newBookings.push({
            date: booking.date,
            time: booking.time,
            facilityNumber: booking.facilityNumber,
            userEmail: booking.userEmail,
            bookingId: bookingDoc.id,
          });
        }
      });
      setBookings(newBookings);
    });
    if (loading) setLoading(false);
    return unsubscribe;
  }, []);

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  const handleCancelBooking = async (
    id,
    facilityId,
    facilityNumber,
    date,
    time
  ) => {
    // cancel bookings in booking collection
    // and remove facilityNumber from the time slot in facility doc's bookings object
    // TODO: inform user that his booking has been cancelled
    try {
      // once deleted from database, onSnapshot will not be triggered
      // and update the bookings state
      const bookingRef = doc(db, "bookings", id);
      const facilityRef = doc(db, "facilities", facilityId);
      // bookings: {date1: {time1: [bookingId1, bookingId2], time2: [...],...},
      //      date2: {time1: [bookingId3, bookingId4], ...}...}
      const facilityDoc = await getDoc(facilityRef);
      if (facilityDoc.exists()) {
        const facilityBookings = await facilityDoc.data().bookings;
        facilityBookings[date][time] = facilityBookings[date][time].filter(
          (num) => num != facilityNumber
        );
        console.log("test");
        updateDoc(facilityRef, {
          bookings: facilityBookings,
        });
      } else {
        console.log("No such facility! Possibly deleted by user.");
      }
      await deleteDoc(bookingRef);
      Msg("", "Booking cancelled successfully!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.facilityBtn} onPress={toggleDropdown}>
        <View style={styles.iconContainer}>{renderIcon(facilityName)}</View>
        <Text style={styles.facilityName}>{facilityName}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.dropdown}>
          <View style={styles.dropdownContent}>
            {bookings
              .filter((booking) =>
                searchQuery === "" ||
                booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.date == (searchQuery) ||
                booking.time == (searchQuery) ||
                booking.facilityNumber == (searchQuery)
              )
              .map((booking) => (
                <BookingItem
                  key={booking.bookingId}
                  id={booking.bookingId}
                  date={booking.date}
                  time={booking.time}
                  facilityId={facilityId}
                  facility={facilityName}
                  facilityNumber={booking.facilityNumber}
                  userEmail={booking.userEmail}
                  onCancel={handleCancelBooking}
                />
              ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  facilityBtn: {
    backgroundColor: "#E5E5E5",
    width: "95%",
    height: 50,
    marginVertical: 5,
    alignSelf: "center",
    justifyContent: "center",
  },

  iconContainer: {
    position: "absolute",
    left: 10,
  },

  facilityName: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    marginLeft: 50,
  },

  dropdown: {
    backgroundColor: "#E5E5E5",
    marginTop: 5,
    padding: 10,
  },

  dropdownContent: {
    alignItems: "center",
  },
});
