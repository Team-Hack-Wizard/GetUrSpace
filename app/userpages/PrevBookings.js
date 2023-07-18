import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingItem from "../components/BookingItem";
import { MaterialIcons } from "@expo/vector-icons";

export default function PrevBookings({ navigation, route }) {
  // bookings in this format:
  // [{ id: '1', facility: 'MPH', venue: 'PGPR', date: '8 July', time: '11.30'}, ... ]
  const { prevBookings } = route.params;

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
          <BookingItem
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
