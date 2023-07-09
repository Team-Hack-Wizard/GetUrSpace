import { Alert } from "react-native";

export default function Msg(title, msg, onOk, onCancel) {
  
  Alert.alert(
  title,
  msg,
  [
    {
      text: "Cancel",
      onPress: onCancel ? onCancel : () => {},
      style: "cancel"
    },
    { text: "OK", onPress: (onOk) ? onOk : () => {}}
  ],
  { cancelable: false }
  );
}