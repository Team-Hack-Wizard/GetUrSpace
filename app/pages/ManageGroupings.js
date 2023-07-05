import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Msg } from '../functions';

export default function ManageGroupings({ navigation, route }) {
  const [addUser, setAddUser] = useState('');
  const [removeUser, setRemoveUser] = useState('');
  const [newGroupName, setGroupName] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const {groupId, groupName} = route.params;

  const handleReturn = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {  
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    const users = groupDoc.get("users");

    if (addUser) {
      //console.log(`Add user: ${addUser}`);
      // add user to group in database
      // query email to get the userdoc
      const q = query(collection(db, "users"), where("email", "==", addUser));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        Msg("Error", "User does not exist");
        return;
      }
      querySnapshot.forEach(async (userDoc) => {
        const uid = userDoc.id;
        const userRef = doc(db, "users", uid);
        // check through the group's users array, if user alr in the group, do nothing
        // else add user to the group in field users array in groupdoc
        // then need to update the group and facilities info in that user
        if (! users.includes(uid)) {
          updateDoc(groupRef, {
            users: arrayUnion(uid),
          });
          // update group and facilities info in that user
          const thisGroup = {
            groupId: groupId,
            groupName: groupName,
            facilities: [],
          }
          // get the info of facilities from thisGroup and add to thisGroup
          for (const facilityId of groupDoc.get("facilities")) {
            const facilityDoc = await getDoc(doc(db, "facilities", facilityId));
            const facility = {
              facilityId: facilityId,
              facilityName: facilityDoc.get("name"),
            }
            thisGroup.facilities.push(facility);
          }
          updateDoc(userRef, {
            groups: arrayUnion(thisGroup),
          })
        }
      });
      
    }

    if (removeUser) {
      console.log(`Remove user: ${removeUser}`);
      // query email to get the userdoc
      const q = query(collection(db, "users"), where("email", "==", removeUser));
      const querySnapshot = await getDocs(q);
      // check if user exists in the current group
      if (querySnapshot.empty) {
        Msg("Error", "User does not exist in the group!");
        return;
      }
      querySnapshot.forEach(async (userDoc) => {
        const uid = userDoc.id;
        const userRef = doc(db, "users", uid);
        const users = groupDoc.get("users");
        // if user is in the group, attemp to remove
        if (users.includes(uid)) { 
          updateDoc(groupRef,  {
            users: arrayRemove(uid),
          })  
          // then need to update the group and facilities info in that user
          const userGroups = [...userDoc.get("groups")];
          // problem: filter not removing the group
          newUserGroups = userGroups.filter(group => group.groupId !== groupId);
          console.log(newUserGroups);
          updateDoc(userRef, {
            groups: newUserGroups,
          })
            
          Msg("", "User removed from group successfully");
        } else {
          Msg("Error", "User does not exist in the group!");
          return;
        }
        
        
      });
    }

    if (newGroupName) {
      // console.log(`Group name: ${newGroupName}`) newGroupName is correct ;
      // update group name in groups document
      await updateDoc(groupRef, {
        "name": newGroupName,
      });
      // update group in all users document 
      const groupDoc = await getDoc(groupRef);
      const users = groupDoc.get("users");
      // for each user in the group, update the group name
      users.forEach(async (uid) => {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        const userGroups = userDoc.get("groups");
        updateDoc(userRef, {
          groups: userGroups.map((group) => {
            // map the group with same group id to the new group name
            if (group.groupId == groupId) {
              const newGroup = {
                ...group,
                groupName: newGroupName,
              };
              return newGroup;
            }
            return group;
          }),
        });
      });
      // update groupNames stored in facilities
      const facilityIds = groupDoc.get("facilities");
      facilityIds.forEach(async (facilityId) => {
        updateDoc(doc(db, "facilities", facilityId), {
          groupName: newGroupName,
        });
      });
      Msg("", "Group name updated successfully");
    }

    if (newFacility) {
      const InitialFacility = {
        groupId: groupId,
        groupName: groupName,
        name: newFacility,
        number: 1,
        bookings: {},
        startTime: 8,
        endTime: 23,
      }
      // add new facility to facilities collection
      const newFacilityRef = await addDoc(collection(db, "facilities"), InitialFacility);
      // update users in the group with the new facility
      // for each user in the group, add facility to the userDoc's groups array
      users.forEach(async (uid) => {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        const userGroups = userDoc.get("groups");
        updateDoc(userRef, {
          groups: userGroups.map((group) => {
            // map the group with same group id to the new group name
            if (group.groupId == groupId) {
              const newGroup = {
                ...group,
                facilities: [...group.facilities, {
                  facilityId: newFacilityRef.id,
                  facilityName: newFacility,
                }],
              };
              return newGroup;
            }
            return group;
          }),
        });
      });

      Msg("", "Facility added successfully"); 
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn} style={styles.icon}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.manageGrp}>
          <Text>Manage Group</Text>
        </Text>
      </View>

      <View>
        <Text style={styles.text}>Add Users</Text>
        <TextInput 
          style={styles.input} 
          selectionColor="#094074" 
          onChangeText={(text) => setAddUser(text)}
        />
      </View>

      <View>
        <Text style={styles.text}>Remove Users</Text>
        <TextInput 
          style={styles.input} 
          selectionColor="#094074" 
          onChangeText={text => setRemoveUser(text)}
        />
      </View>

      <View>
        <Text style={styles.text}>Rename Group</Text>
        <TextInput 
          style={styles.input} 
          selectionColor="#094074" 
          onChangeText={text => setGroupName(text)}
        />
      </View>

      <View>
        <Text style={styles.text}>Add Facility (Enter Facility Name)</Text>
        <TextInput 
          style={styles.input} 
          selectionColor="#094074" 
          onChangeText={text => setNewFacility(text)}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 30,
  },
  manageGrp: {
    fontSize: 30,
    marginHorizontal: 50,
  },
  box: {
    marginVertical: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#E5E5E5',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  submitBtn: {
    width: '90%',
    borderRadius: 10,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 200,
    backgroundColor: '#094074',
  },
  submitText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
