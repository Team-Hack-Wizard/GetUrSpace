import {
  StyleSheet,
  Text,
  FlatList,
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
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.main}>Past Bookings</Text>
      </View>

      <FlatList
        data={prevBookings}
        keyExtractor={( item ) => item.id}
        renderItem={({ item }) => (
          <BookingItem
            key={item.id}
            id={item.id}
            facility={item.facility}
            facilityId={item.facilityId}
            facilityNumber={item.facilityNumber}
            venue={item.venue}
            date={item.date}
            time={item.time}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No past bookings!</Text>
        )}
        nestedScrollEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  box: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 30,
  },

  main: {
    fontSize: 30,
    marginHorizontal: 60,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    color: "#094174",
  },
});
