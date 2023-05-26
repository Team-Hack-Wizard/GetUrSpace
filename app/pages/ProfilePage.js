import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextBox from '../components/TextBox'

export default function ProfilePage({ navigation }) {
    const handleLogOut = () => {
      navigation.navigate('Login', {screen: 'Login'});
    };

  return (
    <SafeAreaView styles={styles.container}>
      <Text style={styles.main}>
        <Text>Profile</Text>
      </Text>

      <Image style={styles.image} source={require('../assets/profile_pic.png')} />

      <Text style={styles.text}>
        <Text>Name</Text>
      </Text>

      <TextBox
        data="Xiao Ming"
      />

      <Text style={styles.text}>
        <Text>Email</Text>
      </Text>

      <TextBox
        data="xxx@u.nus.edu"
      />

      <Text style={styles.text}>
        <Text>Group</Text>
      </Text>

      <TextBox
        data="PGPR"
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
};

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

  image: {
    marginBottom: 40,
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
  },

  text: {
    fontSize: 25,
    marginBottom: 15,
    marginLeft: 20,
  },

  logoutBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 50,
    backgroundColor: '#094074',
  },

  logoutText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})