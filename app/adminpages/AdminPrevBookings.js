import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "../components/Title";
import PrevFacilityButton from "../components/PrevFacilityButton";
import { auth, db } from "../config/firebase";
import {
  doc,
  onSnapshot,
  getDoc,
  collection,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminPrevBookings({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [listData, setListData] = useState([]);
  const handleReturn = () => {
    navigation.goBack();
  };

  const userRef = doc(db, "users", auth.currentUser.uid);
  // get snapshots of user's groups
  // listens to any changes to user's groups
  // gets all the groups and facilities info from the user document
  useEffect(() => {
    const unsubscribe = onSnapshot(userRef, async (userDoc) => {
      if (!loading) setLoading(true);
      const groups = await userDoc.get("groups");
      setGroups(groups);
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
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.main}>Past Bookings</Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.groupId}
        renderItem={({ item }) => (
          <>
            <Title data={item.groupName} />
            {item.facilities.map((facility) => {
              return (
                <PrevFacilityButton
                  key={facility.facilityId}
                  facilityId={facility.facilityId}
                  facilityName={facility.facilityName}
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

  box: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  main: {
    fontSize: 30,
    marginHorizontal: 65,
  },
});
