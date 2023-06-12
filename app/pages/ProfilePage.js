import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextBox from '../components/TextBox'
import { auth, db } from '../config/firebase';
import { doc, onSnapshot } from "firebase/firestore"; 
import { useEffect } from 'react';

export default function ProfilePage() {
  const handleLogOut = () => {
    auth.signOut();
  };
  
  const [name, setName] = useState("");
  const [groups, setGroups] = useState(""); 
  const userRef = doc(db, "users", auth.currentUser.uid);

  useEffect(() => {
    const unsubscribe = onSnapshot(userRef, (doc) => {
      const data = doc.data();
      setName(doc.get("name"));
      setGroups(data.groups.join(", "));
    })
    return unsubscribe;
  }, []);

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
        data={name}
      />

      <Text style={styles.text}>
        <Text>Email</Text>
      </Text>

      <TextBox
        data={auth.currentUser.email}
      />

      <Text style={styles.text}>
        <Text>Group</Text>
      </Text>

      <TextBox
        data={groups}
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