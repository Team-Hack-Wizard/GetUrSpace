import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Title from "../components/Title";
import FacilityButton from "../components/FacilityButton";
import { auth, db } from "../config/firebase";
import {
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";

export default function AdminBookingsPage({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [listData, setListData] = useState([]);
  const handlePress = () => {
    navigation.navigate("Previous Bookings");
  };

  const userRef = doc(db, "users", auth.currentUser.uid);
  // get snapshots of user's groups
  // listens to any changes to user's groups
  // gets all the groups and facilities info from the user document
  useEffect(() => {
    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      if (!loading) setLoading(true);
      const groups = await userDoc.get("groups");
      // we want to pass in to listData: [{id: group1Id, name: groupName,
      //  data: [{id: 1, name: "facility1", number: x}, {id: 2, name: "facility2", number: x}, ...]}, ...]
      let curListData = await Promise.all(
        groups.map(async (group) => {
          return {
            id: group.groupId,
            name: group.groupName,
            data: await Promise.all(
              group.facilities.map(async (facility) => {
                const facilityDoc = await getDoc(
                  doc(db, "facilities", facility.facilityId)
                );
                return {
                  id: facility.facilityId,
                  name: facility.facilityName,
                  number: facilityDoc.data().number,
                };
              })
            ),
          };
        })
      );
      setListData(curListData);
      if (loading) setLoading(false);
    });

    const bookingsRef = collection(db, "bookings");
    const unsubscribeBookings = onSnapshot(bookingsRef, (querySnapshot) => {
      const bookingsData = querySnapshot.docs.map((doc) => doc.data());
      setBookings(bookingsData);
    });
    return () => {
      unsubscribe();
      unsubscribeBookings();
    };
  }, []);

  const windowHeight = Dimensions.get("window").height;

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

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <Title data={item.name} />
            {item.data.map((facility) => {
              return (
                <FacilityButton
                  key={facility.id}
                  facilityId={facility.id}
                  facilityName={facility.name}
                  groupId={item.id}
                  groupName={item.name}
                  number={facility.number}
                  bookings={bookings}
                />
              );
            })}
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
