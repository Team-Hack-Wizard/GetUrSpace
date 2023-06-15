import { StyleSheet, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BookingItem from '../components/BookingItem'

export default function BookingsPage() {
    const [bookings, setBookings] = useState([
      {
        id: '1',
        facility: 'MPH',
        venue: 'PGPR',
        date: '8 July',
        time: '11.30',
      },
      {
        id: '2',
        facility: 'Meeting Room',
        venue: 'PGPR',
        date: '9 July',
        time: '11.30',
      },
      {
        id: '3',
        facility: 'BBQ Pit',
        venue: 'PGPR',
        date: '10 July',
        time: '11.30',
      }
    ]);

    const handleCancelBooking = (bookingId) => {
      setBookings((prevBookings) => 
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
    };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.main}>My Bookings</Text>
      {bookings.map((booking) => (
        <BookingItem
          key={booking.id}
          id={booking.id}
          facility={booking.facility}
          venue={booking.venue}
          date={booking.date}
          time={booking.time}
          onCancel={handleCancelBooking}
        />
      ))}
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  main:{ 
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
})