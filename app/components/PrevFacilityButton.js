import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import BookingItem from "./BookingItem";
import {
  collection,
  onSnapshot,
  where,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";
import moment from "moment";
import { renderIcon } from "../functions";

// facility button receives bookings array where each booking is an object of booking info
// eg: [{facilityId: , facilityName: , groupId: , groupName: ,
// bookings: [{date: , time: , facilityNumber: , userId: , bookingId: },...]}, ... ]
export default function PrevFacilityButton({ facilityId, facilityName, searchQuery }) {
  const [expanded, setExpanded] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) setLoading(true);
    const sgTime = moment().tz("Asia/Singapore");
    const bookingQuery = query(
      collection(db, "bookings"),
      where("facilityId", "==", facilityId),
      where("date", "<=", sgTime.format("YYYY-MM-DD")),
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
        // ensure that this is a past booking
        if (bookingTime.isBefore(sgTime)) {
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
                booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
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
    backgroundColor: "#EBEBEB",
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
