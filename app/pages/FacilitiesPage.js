import {
  StyleSheet, Text, FlatList, Dimensions, ActivityIndicator,
  View
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import FacilityNo from '../components/FacilityNo';
import FacilityItem from '../components/FacilityItem';
import { auth, db } from '../config/firebase';
import { doc, onSnapshot, getDoc } from "firebase/firestore";

export default function FacilitiesPage() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  // tracks the groups the user is in
  const [groups, setGroups] = useState([]);
  // tracks the list of facilities in each group in the following format
  // [{id: group1Id, name: groupName,
  //  data: [{id: 1, name: "facility1"}, ...]}, ...]
  const [listData, setListData] = useState([]);
  const booking = {
    userId: auth.currentUser.uid,
    facilityId: '',
    groupId: '',
    date: '',
    time: '',
    facilityNumber: 0,
  };

  const userRef = doc(db, "users", auth.currentUser.uid);
  // get snapshots of user's groups
  useEffect(() => {
    const unsubscribe = onSnapshot(userRef, async (doc) => {
      const groupIds = await doc.get("groups");
      if (groupIds.length !== groups.length) {
        //console.log("groups changed");
        setGroups([...groupIds]); // array of groupIds of groups user is in
        if (!loading) setLoading(true);
      }
    })
    return unsubscribe;
  }, []);

  // listens to any changes in user's groups and reload accordingly
  // in the process, loading will be set to true
  useEffect(() => {
    //based on the groups, get the list of facilities sorted by the groups
    setLoading(true);
    let curListData = [];
    // we want to pass in [{id: group1Id, name: groupName,
    //  data: [{id: 1, name: "facility1"}, {id: 2, name: "facility2"}, ...]}, ...]
    async function getListData() {
      for (const groupId of groups) {  // for each group
        let groupName;
        let groupDoc;
        try {
          groupDoc = await getDoc(doc(db, "groups", groupId));
          groupName = await groupDoc.get("name");
        } catch (error) {
          console.log("Error getting group name:", error);
        }

        // get the list of facilities in the group then push them into the 
        // listData array with {id: groupId, data: {facilities,...}}
        // where facility is an object of {id: facilityId, name: facilityName}
        try {
          const facilityIds = await groupDoc.get("facilities");
          const facilities = await Promise.all(facilityIds.map(async (facilityId) => {
            const facilityDoc = await getDoc(doc(db, "facilities", facilityId));
            return {
              id: facilityId,
              name: await facilityDoc.get("name"),
            };
          }));
          curListData.push({
            id: groupId,
            name: groupName,
            data: facilities,
          });
        } catch (error) {
          console.log("Error setting listData:", error);
        }
      }
      setListData(curListData);
      setLoading(false);
    }
    getListData();
  }, [groups]);


  // Actual filtering of data is done in render item method of the flatList
  // where only the facilities that match the search query will be rendered
  // or all rendered when query is emtpy
  const handleSearch = (text) => {
    setSearchQuery(text);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
      }
    })
  }, [])

  const windowHeight = Dimensions.get('window').height;

  if (loading) {
    return (
      <SafeAreaView styles={styles.container}>
        <Text style={styles.main}>
          <Text>Facilities</Text>
        </Text>
        <SearchBar
          onChangeText={handleSearch}
          value={searchQuery}
          placeholder='Search'
          autoCorrect={false}
          lightTheme
          round
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
        placeholder='Search'
        autoCorrect={false}
        lightTheme
        round
      />

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <FacilityNo data={item.name} />
            {item.data.map((facility) => {
              if (searchQuery === '' ||
                facility.name.toLowerCase()
                  .includes(searchQuery.toLowerCase())) {
                return (
                  <FacilityItem
                    key={facility.id}
                    navigation={navigation}
                    facilityId={facility.id}
                    facilityName={facility.name}
                    groupId={item.id}
                    booking={{ ...booking }}
                  />
                )
              }
            })
            }
          </>
        )}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: windowHeight * 0.3 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  main: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
})