import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextBox from '../components/TextBox'
import { auth, db } from '../config/firebase';
import { doc, getDoc, onSnapshot } from "firebase/firestore"; 
import { useEffect } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState(""); 
  const [role, setRole] = useState("");
  const userRef = doc(db, "users", auth.currentUser.uid);

  const handleLogOut = () => {
    auth.signOut();
  };
  
  // this updates the name and groups displayed on the profile page
  // whenever there is a change in user document
  useEffect(() => {
    // listens to changes in the user document
    const unsubscribe = onSnapshot(userRef, async (user) => {
      const newName = await user.get("name");
      if (name != newName) setName(newName);
      let groupNames = [];
      const groupsArr = await user.get("groups");
      await Promise.all(groupsArr.map(async (group) => {
        groupNames.push(group.groupName);
      }));
      setGroups(groupNames.join(", "));
      setRole(await user.get("role"));
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

      <Text style={styles.text}>
        <Text>Role</Text>
      </Text>

      <TextBox
        data={role}
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
    marginBottom: 10,
    textAlign: "center",
  },

  image: {
    marginBottom: 10,
    width: 80,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
  },

  text: {
    fontSize: 25,
    marginBottom: 10,
    marginLeft: 20,
  },

  logoutBtn: {
    width: "90%",
    borderRadius: 10,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: '#094074',
  },

  logoutText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
  },
})