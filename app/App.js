import React from "react";
import { StyleSheet } from "react-native";
import ForgotPWPage from "./pages/ForgotPWPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StackNavigator from "./StackNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import { AuthenticatedUserProvider } from "./providers";

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
