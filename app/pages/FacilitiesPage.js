import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

export default function FacilitiesPage() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Performing search: ', searchQuery);
    }

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown:true,
        headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
        }
    })
  },[])

  return (
    <View>
      <TextInput
        style={styles.search}
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        placeholder='Search'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  search: {
    width: "70%",
    borderRadius: 30,
    height: 45,
    backgroundColor: 'gray',
  },
})