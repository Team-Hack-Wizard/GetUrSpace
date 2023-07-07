import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Msg } from '../functions';

export default function ManageGroupings({ navigation, route }) {
  const [addUser, setAddUser] = useState('');
  const [removeUser, setRemoveUser] = useState('');
  const [newGroupName, setGroupName] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [removeFacility, setRemoveFacility] = useState('');
  const {groupId, groupName} = route.params;

  const handleReturn = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    Alert.alert(
      "Confirm Changes?",
      "Are you sure you want to make these changes? Some of the changes may be irreversible.",
      [
        {
          text: "Cancel",
          //onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleConfirm() }
      ],
      { cancelable: false }
    );
  }

  // The Page has many functions, inncluding adding/removing users and facilities and renaming of the group
  // In this funciton, it will check if the input for each field is non-empty
  // If it is, it will call the respective function to add/remove the user/facility or to rename the group
  const handleConfirm = async () => {  
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    const users = groupDoc.get("users");

    if (addUser) {
      addUserFunction(addUser, groupRef, groupDoc, users);      
    }

    if (removeUser) {
      removeUserFunction(removeUser, groupRef, groupDoc, users);
    }

    if (newGroupName) {
      renameGroupFunction(newGroupName, groupRef, groupDoc, users);
    }

    if (newFacility) {
      addFacilityFunction(newFacility, groupRef, groupDoc, users);
    }

    if (removeFacility) {
      removeFacilityFunction(removeFacility, groupRef, groupDoc, users);
    }

  };

  
  async function addUserFunction(addUser, groupRef, groupDoc, users) {
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

  async function removeUserFunction(removeUser, groupRef, groupDoc, users) {
    // console.log(`Remove user: ${removeUser}`);
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
      // if user is in the group, attempt to remove
      if (users.includes(uid)) { 
        updateDoc(groupRef,  {
          users: arrayRemove(uid),
        })  
        // then need to update the group and facilities info in that user
        const userGroups = [...userDoc.get("groups")];
        // problem: filter not removing the group
        const newUserGroups = userGroups.filter(group => group.groupId !== groupId);
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

  async function renameGroupFunction(newGroupName, groupRef, groupDoc, users) {
    // console.log(`Group name: ${newGroupName}`) newGroupName is correct ;
    // update group name in groups document
    await updateDoc(groupRef, {
      "name": newGroupName,
    });
    // update group in all users document that are in the group
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

    // update groupNames stored in bookings
    const bookingQuery = query(collection(db, "bookings"), where("groupId", "==", groupId));
    const bookingQuerySnapshot = await getDocs(bookingQuery);
    bookingQuerySnapshot.forEach(async (bookingDoc) => {
      const bookingId = bookingDoc.id;
      updateDoc(doc(db, "bookings", bookingId), {
        groupName: newGroupName,
      });
    });

    Msg("", "Group name updated successfully");
  }

  async function addFacilityFunction(newFacility, groupRef, groupDoc, users) {
    // check if the facility already exists in the group
    const facilityIds = groupDoc.get("facilities");
    for (const facilityId of facilityIds) { 
      const facilityDoc = await getDoc(doc(db, "facilities", facilityId));
      const facilityName = facilityDoc.get("name");
      if (facilityName === newFacility) {
        Msg("Error", "Facility already exists in the group!");
        return;
      }
    }
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

  // TO BE REVIEWED: Settle issues when removing a facility that is currently booked
  // Currently exisitng bookings should still count, 
  // but the facility should not be available for booking after it is removed
  async function removeFacilityFunction(removeFacility, groupRef, groupDoc, users) {
    // console.log(`Remove facility: ${removeFacility}`);
    // if facility does not exist in the group, give an error message
    const q = query(collection(db, "facilities"), where("name", "==", removeFacility));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      Msg("Error", "Facility does not exist in the group!");
      return;
    }
    // else we attempt to remove this facility from the group Doc
    // And update the group and facilities info in all users
    // lastly delete the facility document
    querySnapshot.forEach(async (facilityDoc) => {
      const facilityId = facilityDoc.id;
      // deleting facility from gorup doc
      updateDoc(groupRef, {
        facilities: arrayRemove(facilityId),
      });
      // deleting facility from all users
      users.forEach(async (uid) => {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        const userGroups = userDoc.get("groups");
        updateDoc(userRef, {
          groups: userGroups.map((group) => {
            // remove the facilityId from the array
            if (group.groupId == groupId) {
              const newGroup = {
                ...group,
                facilities: group.facilities.filter(
                  facility => facility.facilityName !== removeFacility
                  && facility.facilityId !== facilityId),
              };
              return newGroup;
            }
            return group;
          }),
        });
      });

      // deleting facility document
      deleteDoc(doc(db, "facilities", facilityId));
    });

    Msg("", "Facility removed successfully");

    // // deleting all bookings of this facility
    // const bookingsQuery = query(collection(db, "bookings"), where("facilityId", "==", facilityId));
    // const bookingsQuerySnapshot = await getDocs(bookingsQuery);
    // bookingsQuerySnapshot.forEach(async (bookingDoc) => {
    //   const bookingId = bookingDoc.id;
    //   deleteDoc(doc(db, "bookings", bookingId));
    // });

    // // TODO: in app notification to inform users that the facility is removed (for the affected users)
      
  }

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

      <View>
        <Text style={styles.text}>Remove Facility (Enter Facility Name)</Text>
        <TextInput 
          style={styles.input} 
          selectionColor="#094074" 
          onChangeText={text => setRemoveFacility(text)}
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
    //marginTop: 200,
    backgroundColor: '#094074',
  },
  submitText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
