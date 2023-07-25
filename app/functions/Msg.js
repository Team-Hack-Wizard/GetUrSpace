import { Alert } from "react-native";

export default function Msg(title, msg, onOk, onCancel) {
  if (onOk && typeof onOk !== "function") {
    //console.log("onOk is not a function, Msg with title: " + title + " and message: " + msg + " will not be displayed");
    throw new Error("onOk must be a function");
  }
  if (onCancel && typeof onCancel !== "function") {
    //console.log("onOk is not a function, Msg with title: " + title + " and message: " + msg + " will not be displayed");
    throw new Error("onCancel must be a function");
  }

  Alert.alert(
    title,
    msg,
    [
      {
        text: "Cancel",
        onPress: onCancel ? onCancel : () => {},
        style: "cancel",
      },
      { text: "OK", onPress: onOk ? onOk : () => {} },
    ],
    { cancelable: false }
  );
}
