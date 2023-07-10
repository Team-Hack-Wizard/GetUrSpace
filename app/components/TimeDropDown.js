import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

export default function TimeDropDown({ onSelectTime }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const options = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const handleOptionPress = (option) => {
    setModalVisible(false);
    onSelectTime(option);
    setSelectedTime(option.toString());
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {selectedTime ? selectedTime : "Select Timing"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView decelerationRate={0.2}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.option}
                  onPress={() => handleOptionPress(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
