import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import InfoBox from "../components/InfoBox";
import LocationBox from "../components/LocationBox";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export default function FacilityInfo({ navigation, route }) {
  const booking = route.params;
  const [maxHours, setMaxHours] = useState(2);
  const [maxPerHour, setMaxPerHour] = useState(1);
  const [bookInAdvance, setBookInAdvance] = useState(7);
  const [numberOfFacilities, setNumberOfFacilities] = useState(1);
  const [firstBookingSlot, setFirstBookingSlot] = useState(null);
  const [lastBookingSlot, setLastBookingSlot] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [loading, setLoading] = useState(true)

  numberToTime = (num) => {
    return num < 10 ? "0" + num + ":00" : num + ":00";
  }

  useEffect(() => {
    if (!setLoading) setLoading(true);
    const facilityRef = doc(db, "facilities", booking.facilityId);
    const unsubscribe = onSnapshot(facilityRef, (facilityDoc) => {
      const data = facilityDoc.data();
      setMaxHours(data.maxHoursPerWeek);
      setMaxPerHour(data.maxPerHour);
      setBookInAdvance(data.inAdvanceDays);
      setNumberOfFacilities(data.number);
      setFirstBookingSlot(numberToTime(data.startTime));
      setLastBookingSlot(numberToTime(data.endTime));
      setLocationText(data.location);
      if (setLoading) setLoading(false)
    });
    return unsubscribe;
  }, [])

  const handleReturn = () => {
    navigation.goBack();
  };

  const handleProceed = () => {
    navigation.navigate("Date", { ...booking });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.facInfo}>Facility Info</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.box}>
          <Text style={styles.text}>Location: </Text>
          <LocationBox data={locationText} />
        </View>

        <View>
          <Text style={styles.text}>Maximum hours per week</Text>
          <InfoBox data={maxHours} />
        </View>

        <View>
          <Text style={styles.text}>Maximum bookings per hour</Text>
          <InfoBox data={maxPerHour} />
        </View>

        <View>
          <Text style={styles.text}>Book in advance(days)</Text>
          <InfoBox data={bookInAdvance} />
        </View>

        <View>
          <Text style={styles.text}>Number of facilities</Text>
          <InfoBox data={numberOfFacilities} />
        </View>

        <View>
          <Text style={styles.text}>First Booking Slot Timing</Text>
          <InfoBox data={firstBookingSlot} />
        </View>

        <View>
          <Text style={styles.text}>Last Booking Slot Timing</Text>
          <InfoBox data={lastBookingSlot} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
        <Text style={styles.proceedText}>Proceed</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  main: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  facInfo: {
    fontSize: 30,
    marginHorizontal: 80,
  },

  box: {
    marginBottom: 10,
    flexDirection: "row",
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    paddingHorizontal: 20,
  },

  proceedBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 60,
    backgroundColor: "#094074",
  },

  proceedText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
