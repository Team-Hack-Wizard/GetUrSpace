import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";

export default function NumberDropDown({ onSelectNumber, maxNumber }) {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // options range from 1 to maxNumber
  // this needs to be improved
  // problem: when maxNumber was very larger like 15000, the app will crash
  // solution: use FlatList instead of ScrollView (maybe)
  const options = Array.from(Array(Number(maxNumber)).keys()).map((i) => i + 1);

  const handleOptionPress = (option) => {
    setModalVisible(false);
    onSelectNumber(option);
    setSelectedNumber(option.toString());
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {selectedNumber ? selectedNumber : "Select Number"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => handleOptionPress(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: "90%",
    borderRadius: 10,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 16,
  },

  dropdownText: {
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    maxHeight: 300,
    width: "90%",
    elevation: 5,
  },

  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },

  optionText: {
    fontSize: 16,
  },

  closeButton: {
    marginTop: 16,
    alignSelf: "flex-end",
  },

  closeButtonText: {
    color: "#094074",
    fontSize: 16,
  },
});
