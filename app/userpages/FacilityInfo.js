import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import InfoBox from "../components/InfoBox";
import LocationBox from "../components/LocationBox";

export default function FacilityInfo({ navigation, route }) {
  const booking = route.params;
  const handleReturn = () => {
    navigation.goBack();
  };

  const handleProceed = () => {
    navigation.navigate("Date", { ...booking });
  };

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
          <LocationBox data="NUS" />
        </View>

        <View>
          <Text style={styles.text}>Maximum hours per week</Text>
          <InfoBox data="2" />
        </View>

        <View>
          <Text style={styles.text}>Book in advance(days)</Text>
          <InfoBox data="7" />
        </View>

        <View>
          <Text style={styles.text}>Number of facilities</Text>
          <InfoBox data="10" />
        </View>

        <View>
          <Text style={styles.text}>First Booking Slot Timing</Text>
          <InfoBox data="08:00" />
        </View>

        <View>
          <Text style={styles.text}>Last Booking Slot Timing</Text>
          <InfoBox data="23:00" />
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
