import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthenticatedUserProvider } from "./providers";
import { RootNavigator } from './navigation/RootNavigator';

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
