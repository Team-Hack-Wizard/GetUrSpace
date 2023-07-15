import {
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import InteractiveTitle from "../components/InteractiveTitle";
import AdminFacItem from "../components/AdminFacItem";
import { auth, db } from "../config/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

export default function AdminFacilities() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  // [{id: group1Id, name: groupName,
  //  data: [{id: 1, name: "facility1"}, ...]}, ...]
  const [listData, setListData] = useState([]);

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
    return unsubscribe;
  }, []);

  // Actual filtering of data is done in render item method of the flatList
  // where only the facilities that match the search query will be rendered
  // or all rendered when query is empty

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
    });
  }, []);

  const windowHeight = Dimensions.get("window").height;

  if (loading) {
    return (
      <SafeAreaView styles={styles.container}>
        <Text style={styles.main}>
          <Text>Facilities</Text>
        </Text>
        <SearchBar
          onChangeText={handleSearch}
          value={searchQuery}
          placeholder="Search"
          autoCorrect={false}
          lightTheme
          round
        />
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
    <SafeAreaView styles={styles.container}>
      <Text style={styles.main}>
        <Text>Facilities</Text>
      </Text>

      <SearchBar
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder="Search"
        autoCorrect={false}
        lightTheme
        round
      />

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <InteractiveTitle
              navigation={navigation}
              data={{ groupId: item.id, groupName: item.name }}
            />
            {item.data.map((facility) => {
              if (
                searchQuery === "" ||
                facility.name.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                return (
                  <AdminFacItem
                    key={facility.id}
                    navigation={navigation}
                    facilityId={facility.id}
                    facilityName={facility.name}
                    groupId={item.id}
                    groupName={item.name}
                    number={facility.number}
                  />
                );
              }
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
    alignItems: "center",
  },

  main: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
});
