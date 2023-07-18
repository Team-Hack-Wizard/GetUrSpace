import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { View, Text, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { AuthenticatedUserContext } from "../providers";
import { auth, db } from "../config";
import AdminAppStack from "./AdminAppStack";

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        // only set user if authenticatedUser exists and email is verified
        if (authenticatedUser && authenticatedUser.emailVerified) {
          setUser(authenticatedUser);
          try {
            const userDoc = await getDoc(
              doc(db, "users", authenticatedUser.uid)
            );
            const userRole = await userDoc.data().role;
            setRole(userRole);
          } catch (error) {
            console.log(error);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if user is logged in, check role of user
  // if role is admin, show admin app stack
  // if role is user, show app stack

  if (!user || role === "") {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {role === "user" ? (
        <AppStack />
      ) : role === "admin" ? (
        <AdminAppStack />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>
            Unknown Error. Wrong role type. Please email the developer!
          </Text>
        </View>
      )}
    </NavigationContainer>
  );
};
