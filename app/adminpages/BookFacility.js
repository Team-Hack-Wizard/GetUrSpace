import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import CalendarDropDown from "../components/CalendarDropDown";
import NumberDropDown from "../components/NumberDropDown";
import TimeDropDown from "../components/TimeDropDown";
import { Msg } from "../functions";
import { db, auth } from "../config/firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";

export default function BookFacility({ navigation, route }) {
  const { facilityId, facilityName, groupId, groupName, number } = route.params;
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(23);

  useEffect(() => {
    async function getTime() {
      const facilityDoc = await getDoc(doc(db, "facilities", facilityId));
      setStartTime(facilityDoc.data().startTime);
      setEndTime(facilityDoc.data().endTime);
    }
    getTime();
  }, []);

  const handleReturn = () => {
    navigation.goBack();
  };

  const handleSettings = () => {
    navigation.navigate("Facility Settings", route.params);
  };

  // child componenet will handle the UI of selection page
  // Then pass back the selected data to the parent component
  const handleFromDateSelect = (selectedDate) => {
    setFromDate(selectedDate);
  };

  const handleToDateSelect = (selectedDate) => {
    if (fromDate && selectedDate >= fromDate) {
      setToDate(selectedDate);
    } else {
      // Show an error message or handle the invalid selection here
      Msg("Invalid Date", `Please choose a date later than ${fromDate}.`);
    }
  };

  const handleFromTimeSelect = (selectedTime) => {
    setFromTime(selectedTime.toString());
  };

  const handleToTimeSelect = (selectedTime) => {
    if (fromDate === toDate && selectedTime <= fromTime) {
      // Show an error message or handle the invalid selection here
      setToTime(null);
      Msg("Invalid Time", `Please choose a time later than ${fromTime}.`);
    } else {
      setToTime(selectedTime.toString());
    }
  };

  const handleNumberSelect = (selectedNumber) => {
    setSelectedNumber(selectedNumber.toString());
  };

  const handleBook = async () => {
    if (
      fromDate === null ||
      toDate === null ||
      fromTime === null ||
      toTime === null ||
      selectedNumber === null
    ) {
      Msg("Invalid Input", "Please fill in all the fields.");
    } else {
      const start = moment(`${fromDate}T${fromTime}`);
      const end = moment(`${toDate}T${toTime}`);
      const facilityRef = doc(db, "facilities", facilityId);
      const facilityDoc = await getDoc(facilityRef);
      const dailyStart = facilityDoc.data().startTime;
      const dailyEnd = facilityDoc.data().endTime;

      const newFacBooking = facilityDoc.data().bookings;
      // loop through from start to end
      while (start.isBefore(end)) {
        // add the booking in bookings document as well as the facility's bookings array
        const bookingRef = addDoc(collection(db, "bookings"), {
          date: start.format("YYYY-MM-DD"),
          time: start.hours(),
          facilityId: facilityId,
          facilityName: facilityName,
          groupId: groupId,
          groupName: groupName,
          facilityNumber: selectedNumber,
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
        });

        if (!newFacBooking[start.format("YYYY-MM-DD")]) {
          newFacBooking[start.format("YYYY-MM-DD")] = {};
        }
        if (!newFacBooking[start.format("YYYY-MM-DD")][start.hours()]) {
          newFacBooking[start.format("YYYY-MM-DD")][start.hours()] = [];
        }
        newFacBooking[start.format("YYYY-MM-DD")][start.hours()].push(
          selectedNumber
        );

        // increment start by 1 hour each time
        // if it go past the normal operating hours, increment to next day startTime

        if (start.hour() == dailyEnd) {
          start.add(1, "day");
          start.hours(dailyStart);
        } else {
          start.add(1, "hour");
        }
      }
      await updateDoc(facilityRef, {
        bookings: newFacBooking,
      });
      Msg("Booking Successful", "Your booking has been made successfully.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.bookFac}>Book Facility</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="ios-settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.text}>From Date:</Text>
        <CalendarDropDown
          onSelectDate={handleFromDateSelect}
        />
      </View>

      <View>
        <Text style={styles.text}>To Date:</Text>
        <CalendarDropDown
          onSelectDate={handleToDateSelect}
        />
      </View>

      <View key={"fromTime" + startTime + endTime}>
        <Text style={styles.text}>From Time:</Text>
        <TimeDropDown
          onSelectTime={handleFromTimeSelect}
          startTime={startTime}
          endTime={endTime}
          value={fromTime}
        />
      </View>

      <View key={"toTime" + startTime + endTime}>
        <Text style={styles.text}>To Time:</Text>
        <TimeDropDown
          onSelectTime={handleToTimeSelect}
          startTime={startTime}
          endTime={endTime}
          value={toTime}
        />
      </View>

      <View>
        <Text style={styles.text}>Facility Number</Text>
        <NumberDropDown
          onSelectNumber={handleNumberSelect}
          maxNumber={number}
        />
      </View>

      <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
        <Text style={styles.bookText}>Book</Text>
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

  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    paddingHorizontal: 20,
  },

  bookFac: {
    fontSize: 30,
    marginHorizontal: 60,
  },

  dropdown: {
    width: "90%",
    borderRadius: 10,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 16,
  },

  dropdownText: {
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
  },

  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  calendar: {
    marginTop: 40,
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    padding: 10,
  },

  bookBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 90,
    backgroundColor: "#094074",
  },

  bookText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
