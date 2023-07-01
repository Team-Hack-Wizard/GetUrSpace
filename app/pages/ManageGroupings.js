import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function ManageGroupings({ navigation }) {
  const handleReturn = () => {
    navigation.goBack();
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
        <TextInput style={styles.input} selectionColor="#094074" />
      </View>

      <View>
        <Text style={styles.text}>Remove Users</Text>
        <TextInput style={styles.input} selectionColor="#094074" />
      </View>

      <View style={styles.box}>
        <Text style={styles.text}>Rename Group</Text>
        <TextInput style={styles.input} selectionColor="#094074" />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleReturn}>
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
