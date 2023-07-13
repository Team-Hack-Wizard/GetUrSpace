import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminPrevBookings({ navigation }) {
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
