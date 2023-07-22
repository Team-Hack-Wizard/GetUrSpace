import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity, 
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Title from "../components/Title";
import FacilityButton from "../components/FacilityButton";
import { auth, db } from "../config/firebase";
import {
  doc,
  onSnapshot, 
} from "firebase/firestore";

export default function AdminBookingsPage({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const handlePress = () => {
    navigation.navigate("Previous Bookings");
  };

  // get the list of bookings under the group that the admin is managing
  // in a nested object of group -> [facilities] -> [bookings]
  useEffect(() => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      if (!loading) setLoading(true);
      const groups = await userDoc.get("groups");
      setGroups(groups); 
      if (loading) setLoading(false);
    }); 
    return unsubscribe;
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const windowHeight = Dimensions.get("window").height;

  if (loading) {
    return (
      <SafeAreaView styles={styles.container}>
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
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={styles.main}>Bookings</Text>
        </View>
        <TouchableOpacity onPress={handlePress}>
          <AntDesign name="calendar" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <SearchBar
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder="Search"
        autoCorrect={false}
        lightTheme
        round
      />

      <FlatList
        data={groups}
        keyExtractor={(item) => item.groupId}
        renderItem={({ item }) => (
          <>
            <Title data={item.groupName} />
            {item.facilities.map((facility) => (
              <FacilityButton
                key={facility.facilityId}
                facilityId={facility.facilityId}
                facilityName={facility.facilityName}
                searchQuery={searchQuery}
              />
            ))}
          </>
        )}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: windowHeight * 0.3 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  main: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },

  header: {
    marginLeft: 120,
  },

  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "90%",
  },
});
