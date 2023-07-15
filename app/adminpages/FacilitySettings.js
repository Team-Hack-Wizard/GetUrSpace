import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import TimeDropDown from "../components/TimeDropDown";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Msg } from "../functions";

export default function FacilitySettings({ navigation, route }) {
  const { facilityId, facilityName, groupId, groupName, number } = route.params;
  const [maxHours, setMaxHours] = useState(2);
  const [maxPerHour, setMaxPerHour] = useState(1);
  const [bookInAdvance, setBookInAdvance] = useState(7);
  const [renameFacility, setRenameFacility] = useState("");
  const [numberOfFacilities, setNumberOfFacilities] = useState(1);
  const [firstBookingSlot, setFirstBookingSlot] = useState(null);
  const [lastBookingSlot, setLastBookingSlot] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [initialName, setInitialName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFacilityInfo() {
      const facilityDoc = (
        await getDoc(doc(db, "facilities", facilityId))
      ).data();
      if (facilityDoc.maxHoursPerWeek) setMaxHours(facilityDoc.maxHoursPerWeek);
      if (facilityDoc.maxPerHour) setMaxPerHour(facilityDoc.maxPerHour);
      if (facilityDoc.inAdvanceDays)
        setBookInAdvance(facilityDoc.inAdvanceDays);
      if (facilityDoc.number) setNumberOfFacilities(facilityDoc.number);
      if (facilityDoc.startTime) {
        const time = facilityDoc.startTime;
        setFirstBookingSlot(time < 10 ? `0${time}:00` : `${time}:00`);
      }
      if (facilityDoc.endTime) {
        const time = facilityDoc.endTime;
        setLastBookingSlot(time < 10 ? `0${time}:00` : `${time}:00`);
      }
      if (facilityDoc.name) {
        setInitialName(facilityDoc.name);
        setRenameFacility(facilityDoc.name);
      }
      if (facilityDoc.location) setLocationText(facilityDoc.location);
      setLoading(false);
    }
    getFacilityInfo();
  }, []);

  const handleReturn = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    Alert.alert(
      "Confirm Changes?",
      "Are you sure you want to make these changes?" +
        "For fields that are amended, all changes will be made together. ",
      [
        {
          text: "Cancel",
          //onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleConfirm() },
      ],
      { cancelable: false }
    );
  };

  const handleConfirm = async () => {
    try {
      // Save the changes to the facility doc
      const facilityRef = doc(db, "facilities", facilityId);
      // Below info are rendered initially to show the current settings
      updateDoc(facilityRef, {
        maxHoursPerWeek: maxHours,
        maxPerHour: maxPerHour,
        InAdvanceDays: bookInAdvance,
        number: numberOfFacilities,
        startTime: Number(firstBookingSlot.slice(0, 2)),
        endTime: Number(lastBookingSlot.slice(0, 2)),
        name: renameFacility,
        location: locationText,
      });

      // if admin attempts to rename facility, need to update facility name in all copies
      // in users' groups and bookings
      // and update facility name in all bookings
      if (renameFacility !== initialName) {
        // first get the array of userIds from group doc's users field
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        const userIds = groupDoc.data().users;
        // for each user, go to the groups field to update the facility name underneath
        await Promise.all(
          userIds.map(async (userId) => {
            const userDoc = await getDoc(doc(db, "users", userId));
            const groups = userDoc.data().groups;
            updateDoc(doc(db, "users", userId), {
              groups: await Promise.all(
                groups.map(async (group) => {
                  // only ammend the group we are in, so that we can find the correct facility
                  if (group.groupId === groupId) {
                    group.facilities = await Promise.all(
                      group.facilities.map(async (facility) => {
                        if (facility.facilityId === facilityId) {
                          facility.facilityName = renameFacility;
                        }
                      })
                    );
                  }
                  return group;
                })
              ),
            });
          })
        );

        // then go to the bookings collection to update the facility name
        const bookingQueries = query(
          collection(db, "bookings"),
          where("facilityId", "==", facilityId)
        );
        const bookingDocs = await getDocs(bookingQueries);
        await Promise.all(
          bookingDocs.map(async (bookingDoc) => {
            updateDoc(doc(db, "bookings", bookingDoc.id), {
              facilityName: renameFacility,
            });
          })
        );
      }
    } catch (error) {
      console.log(error);
      Msg(
        "Error",
        "Failed to save changes. Please try again later." + error.message
      );
    }

    // Then navigate back to the facilities page
    navigation.navigate("Facilities");
  };

  const handleStartTimeSelect = (selectedTime) => {
    setFirstBookingSlot(selectedTime.toString());
  };

  const handleEndTimeSelect = (selectedTime) => {
    if (selectedTime < firstBookingSlot) {
      // Show an error message or handle the invalid selection here
      Msg(
        "Invalid End Time",
        `Please choose a time later than ${firstBookingSlot}.`
      );
      setLastBookingSlot(null);
    } else {
      setLastBookingSlot(selectedTime.toString());
    }
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
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.main}>
          <TouchableOpacity onPress={handleReturn}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.facInfo}>Facility Settings</Text>
        </View>

        <View>
          <Text style={styles.text}>Maximum hours per week</Text>
          <TextInput
            style={styles.input}
            selectionColor="#094074"
            keyboardType="numeric"
            onChangeText={(text) => setMaxHours(text)}
            value={maxHours.toString()}
          />
        </View>

        <View>
          <Text style={styles.text}>Maximum facilities per hour</Text>
          <TextInput
            style={styles.input}
            selectionColor="#094074"
            keyboardType="numeric"
            onChangeText={setMaxPerHour}
            value={maxPerHour.toString()}
          />
        </View>

        <View>
          <Text style={styles.text}>Book in advance(days)</Text>
          <TextInput
            style={styles.input}
            selectionColor="#094074"
            keyboardType="numeric"
            onChangeText={(text) =>
              setBookInAdvance(text.replace(/[^0-9]/g, ""))
            }
            value={bookInAdvance.toString()}
          />
        </View>

        <View>
          <Text style={styles.text}>Rename Facility</Text>
          <TextInput
            style={styles.input}
            selectionColor="#094074"
            onChangeText={(text) => setRenameFacility(text)}
            value={renameFacility.toString()}
          />
        </View>

        <View>
          <Text style={styles.text}>Number of facilities</Text>
          <TextInput
            style={styles.input}
            selectionColor="#094074"
            keyboardType="numeric"
            onChangeText={(text) =>
              setNumberOfFacilities(text.replace(/[^0-9]/g, ""))
            }
            value={numberOfFacilities.toString()}
          />
        </View>

        <View>
          <Text style={styles.text}>First Booking Slot Timing</Text>
          <TimeDropDown
            onSelectTime={handleStartTimeSelect}
            startTime={0}
            endTime={23}
            value={firstBookingSlot}
          />
        </View>

        <View key={"last" + lastBookingSlot}>
          <Text style={styles.text}>Last Booking Slot Timing</Text>
          <TimeDropDown
            onSelectTime={handleEndTimeSelect}
            startTime={0}
            endTime={23}
            value={lastBookingSlot}
          />
        </View>

        <View>
          <Text style={styles.text}>Location</Text>
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={10}
            selectionColor="#094074"
            onChangeText={setLocationText}
            value={locationText.toString()}
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginHorizontal: 50,
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    paddingHorizontal: 20,
  },

  input: {
    width: "90%",
    borderRadius: 10,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 16,
  },

  saveBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 60,
    backgroundColor: "#094074",
  },

  saveText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
