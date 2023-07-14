import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";
import {
  query,
  collection,
  where,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Msg } from "../functions";

export default function DatePage({ navigation, route }) {
  const booking = route.params;
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  // this ensures that the date always follows the singapore timezone date
  const moment = require("moment-timezone");
  const sgDate = moment().tz("Asia/Singapore");
  const minDate = sgDate.format("YYYY-MM-DD");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const facilityRef = doc(db, "facilities", booking.facilityId);
    const unsubscribe = onSnapshot(facilityRef, async (facilityDoc) => {
      if (!loading) setLoading(true);
      const inAdvanceDays = await facilityDoc.data().inAdvanceDays;
      const max = sgDate.clone().add(inAdvanceDays, "d").format("YYYY-MM-DD");
      setMaxDate(max);
      if (loading) setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleContinue = async () => {
    // check the number of bookings under this user, for this facility in the week of the selected date
    // pop of notification if the number of bookings is more than the maxHoursPerWeek limit set by admin
    if (!loading) setLoading(true);
    const date = moment(selectedDate);
    // make the week start on Monday and end on Sunday (default is sunday to saturday)
    const weekStart = date.clone().startOf("week").add(1, "d");
    const weekEnd = date.clone().endOf("week").add(1, "d");
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", booking.userId),
      where("facilityId", "==", booking.facilityId),
      where("date", ">=", weekStart.format("YYYY-MM-DD")),
      where("date", "<=", weekEnd.format("YYYY-MM-DD"))
    );
    const snapshots = await getDocs(q);
    const facilityDoc = await getDoc(doc(db, "facilities", booking.facilityId));
    const maxHoursPerWeek = facilityDoc.data().maxHoursPerWeek;
    if (snapshots.size >= maxHoursPerWeek) {
      // pop up notification
      console.log("max hours per week reached");
      Msg(
        "Max Hours Per Week Reached",
        `You have reached the maximum number of hours per week (${maxHoursPerWeek} hours) for this facility. ` +
          "Please select another facility or date, or cancel the existing bookings in that week."
      );
    } else {
      navigation.navigate("Time", {
        ...booking,
        date: selectedDate,
      });
      // pass down booking info to the next page
    }
    if (!loading) setLoading(false);
  };

  const handleReturn = () => {
    navigation.navigate("Facilities");
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    // dataString is in the format YYYY-MM-DD
  };

  const isContinueDisabled = selectedDate === "";

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
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.selectDate}>
          <Text>Select Date</Text>
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, disableTouchEvent: true },
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.continueBtn,
          { backgroundColor: isContinueDisabled ? "#E6E6E6" : "#094074" },
        ]}
        onPress={handleContinue}
        disabled={isContinueDisabled}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  main: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },

  selectDate: {
    fontSize: 30,
    marginHorizontal: 80,
  },

  calendarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
  },

  calendar: {
    aspectRatio: 1.2,
    // justifyContent: "flex-start",
    // marginVertical: 50,
    width: "100%",
  },

  continueBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 120,
    backgroundColor: "#094074",
  },

  continueText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
