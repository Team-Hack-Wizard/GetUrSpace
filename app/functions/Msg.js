import { Alert } from "react-native";

export default function Msg(title, msg) {
  
  Alert.alert(
  title,
  msg,
  [
    {
      text: "Cancel",
      //onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
    { text: "OK" }
  ],
  { cancelable: false }
  );
}