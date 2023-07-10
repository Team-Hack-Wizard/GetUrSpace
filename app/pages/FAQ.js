import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function FAQ({ navigation, route }) {
  const [expandedQns, setExpandedQns] = useState([]);

  const handleReturn = () => {
    if (route.params?.resetProfilePage) {
      route.params.resetProfilePage();
    }
    navigation.navigate("Profile");
  };

  const toggleQuestion = (index) => {
    if (expandedQns.includes(index)) {
      setExpandedQns(expandedQns.filter((item) => item !== index));
    } else {
      setExpandedQns([...expandedQns, index]);
    }
  };

  const isQuestionExpanded = (index) => expandedQns.includes(index);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <TouchableOpacity onPress={handleReturn}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>
          <Text>Support</Text>
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} decelerationRate={0.2}>
        {faqData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.qnsContainer}
            onPress={() => toggleQuestion(index)}
          >
            <Text style={styles.qns}>{item.qns}</Text>
            {isQuestionExpanded(index) && (
              <Text style={styles.ans}>{item.ans}</Text>
            )}
            {index !== faqData.length - 1 && <View style={styles.separator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const faqData = [
  {
    qns: "How do I register an account?",
    ans: 'To register an account, navigate to the app\'s "Register" page and fill in the required information, such as school email address and password. Follow the prompts to complete the registration process.',
  },
  {
    qns: "How can I log in to my account?",
    ans:
      'On the app\'s Login page, enter your school email address and password. Click the "Login" button to access your account.\n' +
      "\n" +
      "For first time users, you will need to verify your email address after registering your account. Do check your inbox for the verification email.",
  },
  {
    qns: "How can I reset my password?",
    ans:
      'If you\'ve forgotten your password, click on the "Forgot Password?" link on the "Login" page. Follow the instructions to reset your password via email.\n' +
      "\n" +
      'If you want to change your password instead, you can navigate to the "Profile" section and reset your password via the "Reset Password" option after clicking on the Settings icon.',
  },
  {
    qns: "How can I book a facility?",
    ans:
      "To book a facility in the school, you can follow these steps:\n" +
      "1. Log in to your account.\n" +
      "2. Select the desired facility from the available options.\n" +
      "3. Choose the date/time slot for the facility number you want for your booking.\n" +
      "4. Confirm your booking details and submit the request.\n" +
      "5. Your booking will be approved instantly if it is available.\n" +
      "\n" +
      'View your bookings under the "Bookings" section.',
  },
  {
    qns: "Can I cancel my booking?",
    ans: 'Yes, you can cancel your booking. Log in to your account and go to the "Bookings" section. Find the booking you wish to cancel and click on the "Cancel" button.',
  },
  {
    qns: "Can I book multiple facilities for the same time slot?",
    ans: "No, you cannot book multiple facilities for the same time slot. Each facility can only be booked by one user at a time.",
  },
  {
    qns: "How far in advance can I book a facility?",
    ans: "You can book a facility up to one week in advance. The booking system will indicate the available booking window. Bookings beyond that timeframe may not be accepted.",
  },
  {
    qns: "How can I check the availability of a facility?",
    ans: "Only available date/time slots will be displayed to you when booking a facility. You can browse through the available options to find facilities that meet your requirements. ",
  },
  {
    qns: "What should I do if I encounter technical issues or need further assistance?",
    ans:
      "If you experience any technical issues or require assistance, you can reach out to us by navigating to the Profile tab and find the Contact Us form through the Settings icon.\n" +
      "\n" +
      "Provide a detailed description of the problem you are facing, and our team will respond to your inquiry as soon as possible.",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  main: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    marginLeft: 90,
    marginRight: 115,
  },

  qnsContainer: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  qns: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  ans: {
    fontSize: 16,
  },

  separator: {
    marginTop: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});
