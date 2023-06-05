import { StyleSheet, Text, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import FacilityNo from '../components/FacilityNo';
import FacilityItem from '../components/FacilityItem';

const nusFacilitiesData = [
  {id: 1, name: 'Multi Purpose Hall'},
  {id: 2, name: 'Meeting Rooms'},
  {id: 3, name: 'Dance Studios'},
  {id: 4, name: 'BBQ Pit'},
  {id: 5, name: 'Gym'},
  {id: 6, name: 'Study Pods'},
];

const altFacilitiesData = [
  {id: 1, name: 'BBQ Pit'},
  {id: 2, name: 'Gym'},
  {id: 3, name: 'Study Pods'},
  {id: 4, name: 'Meeting Rooms'},
];

export default function FacilitiesPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNUSFacilities, setFilteredNUSFacilities] = useState(nusFacilitiesData);
    const [filteredAltFacilities, setFilteredAltFacilities] = useState(altFacilitiesData);
    const [resetSelection, setResetSelection] = useState(false);  

    const handleSearch = (text) => {
      setSearchQuery(text);

      const filteredNUS = nusFacilitiesData.filter((facility) => 
        facility.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredNUSFacilities(filteredNUS);

      const filteredAlt = altFacilitiesData.filter((facility) => 
        facility.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAltFacilities(filteredAlt);
    }
      
    useLayoutEffect(() => {
      navigation.setOptions({
          headerShown:false,
          headerTitleStyle: {
              fontSize: 20,
              fontWeight: "bold",
          }
      })
    },[])

    useEffect(() => {
      if (route?.params?.resetSelection) {
        setResetSelection(true);
      }
    }, [route?.params?.resetSelection]);

    useEffect(() => {
      if (resetSelection) {
        const updatedNUSFacilities = filteredNUSFacilities.map((facility) => ({
          ...facility,
          selected: false,
        }));
    
        const updatedAltFacilities = filteredAltFacilities.map((facility) => ({
          ...facility,
          selected: false,
        }));
    
        setFilteredNUSFacilities(updatedNUSFacilities);
        setFilteredAltFacilities(updatedAltFacilities);
        setResetSelection(false);
      }
    }, [resetSelection]);

    const windowHeight = Dimensions.get('window').height;

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
        data={[
          { title: 'NUS', data: filteredNUSFacilities },
          { title: 'PGPR', data: filteredAltFacilities },
        ]}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <>
            <FacilityNo data={item.title} />
            {item.data.map((facility) => (
              <FacilityItem
                key={facility.id}
                name={facility.name}
                navigation={navigation}
                selected={facility.selected}
                setSelected={(value) => {
                  const updatedData = item.data.map((f) => {
                    if (f.id === facility.id) {
                      return { ...f, selected: value };
                    }
                    return f;
                  });
                  if (item.title === 'NUS') {
                    setFilteredNUSFacilities(updatedData);
                  } else if (item.title === 'PGPR') {
                    setFilteredAltFacilities(updatedData);
                  }
                }}
              />
            ))}
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

  main:{ 
    fontSize: 30,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
})