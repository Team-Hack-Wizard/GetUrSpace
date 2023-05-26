import { StyleSheet, Text, View, TextInput, FlatList, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FacilitiesPage() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Performing search: ', searchQuery);
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

  return (
    <SafeAreaView styles={styles.container}>
      <Text style={styles.main}>
        <Text>Facilities</Text>
      </Text>

      <SearchBar
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        placeholder='Search'
        autoCorrect={false}
        lightTheme
        round
      />

      <ScrollView>
        
      </ScrollView>
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