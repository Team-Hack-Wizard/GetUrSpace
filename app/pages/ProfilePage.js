import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBox from "../components/TextBox";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../config/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function ProfilePage({ navigation, route }) {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState("");
  const userRef = doc(db, "users", auth.currentUser.uid);
  const [modalVisible, setModalVisible] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSettings = () => {
    setModalVisible(true);
  };

  const handleContactUs = () => {
    setShowContactForm(true);
  };

  const handleFAQ = () => {
    navigation.navigate("FAQ");
  };

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false); // Reset the state of ProfilePage
    }, [])
  );

  const handleResetPassword = () => {
    Alert.alert(
      "Reset Password",
      "Are you sure you want to reset your password?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            auth
              .sendPasswordResetEmail(auth.currentUser.email)
              .then(() => {
                Alert.alert(
                  "",
                  "A password reset link has been sent to your email!"
                );
              })
              .catch((error) => {
                Alert.alert("Error!", error.code + "\n" + error.message);
                console.log(error.message);
                return;
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleClose = () => {
    setShowContactForm(false);
    setModalVisible(false);
  };

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
      await Promise.all(
        groupsArr.map(async (group) => {
          groupNames.push(group.groupName);
        })
      );
      setGroups(groupNames.join(", "));
    });
    return unsubscribe;
  }, []);

  const handleFormInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const submitForm = () => {
    console.log("Form Data:", formData);
    setFormData({ name: "", email: "", message: "" });
    setShowContactForm(false);
    setModalVisible(false);
    Alert.alert(
      "Successful!",
      "Thanks. We will get in touch with you as soon as possible."
    );
  };

  return (
    <SafeAreaView styles={styles.container}>
      <View style={styles.box}>
        <Text style={styles.main}>Profile</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="ios-settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image
        style={styles.image}
        source={require("../assets/profile_pic.png")}
      />

      <Text style={styles.text}>
        <Text>Name</Text>
      </Text>

      <TextBox data={name} />

      <Text style={styles.text}>
        <Text>Email</Text>
      </Text>

      <TextBox data={auth.currentUser.email} />

      <Text style={styles.text}>
        <Text>Group</Text>
      </Text>

      <TextBox data={groups} />

      <Text style={styles.text}>
        <Text>Role</Text>
      </Text>

      <TextBox data="User" />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          {showContactForm ? (
            <View style={styles.modalBox}>
              <TextInput
                style={styles.formInput}
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => handleFormInputChange("name", text)}
              />
              <TextInput
                style={styles.formInput}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleFormInputChange("email", text)}
              />
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message"
                value={formData.message}
                onChangeText={(text) => handleFormInputChange("message", text)}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={submitForm}>
                <Text style={styles.submitText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <React.Fragment>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleContactUs}
              >
                <FontAwesome name="envelope-o" size={24} color="black" />
                <Text style={styles.modalOptionText}>Contact Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={handleFAQ}>
                <Feather name="help-circle" size={24} color="black" />
                <Text style={styles.modalOptionText}>FAQ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleResetPassword}
              >
                <MaterialCommunityIcons
                  name="lock-reset"
                  size={24}
                  color="black"
                />
                <Text style={styles.modalOptionText}>Reset Password</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  box: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  main: {
    fontSize: 30,
    marginLeft: 132,
    marginRight: 110,
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
    backgroundColor: "#094074",
  },

  logoutText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalBox: {
    alignItems: "center",
  },

  modalOption: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    width: 250,
  },

  modalOptionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },

  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#094074",
  },

  submitBtn: {
    backgroundColor: "#00B000",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: "center",
  },

  submitText: {
    color: "white",
    fontWeight: "bold",
  },

  formInput: {
    width: 300,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  messageInput: {
    width: 300,
    height: 150,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    textAlignVertical: "top",
    paddingTop: 10,
  },
});
