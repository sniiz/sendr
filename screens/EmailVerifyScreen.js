import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "../firebase";
import { onAuthStateChanged, sendEmailVerification } from "../firebase";
import UIText from "../components/LocalizedText";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

const version = require("../assets/version-info.json");

export default function EmailVerifyScreen({ navigation, route }) {
  const auth = getAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user?.emailVerified) {
        navigation.replace("home");
      }
    });
    return () => {
      unsub();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#0a0a0a" },
      headerTintColor: "#F2F7F2",
      headerLeft: () => null,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.version}>
        v{version.number}
        {"\n"}✨ {version.name} ✨
      </Text>
      <Text style={styles.title}>
        {UIText["emailVerifyScreen"]["title"]}{" "}
        <Text
          style={{
            color: "#727178",
            fontSize: 12,
            // marginVertical: "50%",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >{`(${auth?.currentUser?.email})`}</Text>
      </Text>
      <TouchableOpacity
        onPress={() => {
          sendEmailVerification(auth?.currentUser)
            .then(() => {
              setSent(true);
            })
            .catch((error) => {
              alert(error.message);
            });
        }}
        style={{
          // backgroundColor: "#F2F7F2",
          borderRadius: 5,
          borderWidth: 2,
          borderColor: "#F2F7F2",
          padding: 10,
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <Text style={styles.text}>
          {sent
            ? UIText["emailVerifyScreen"]["sentButton"]
            : UIText["emailVerifyScreen"]["verifyButton"]}
        </Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>
        {UIText["emailVerifyScreen"]["didNotReceiveEmail"]}
      </Text>
      <TouchableOpacity
        onPress={() => {
          signOut(auth).then(() => {
            navigation.replace("login");
          });
        }}
        style={{
          borderRadius: 5,
          borderWidth: 2,
          borderColor: "red",
          marginTop: 100,
          padding: 10,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={[
            styles.text,
            {
              color: "red",
              // marginTop: 20,
              fontWeight: "normal",
            },
          ]}
        >
          {UIText["settingsScreen"]["logOutButton"]}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  version: {
    color: "#727178",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
  },
  subtitle: {
    color: "#727178",
    fontSize: 15,
    textAlign: "center",
  },
  title: {
    color: "#F2F7F2",
    fontSize: 40,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    overflow: "visible",
  },
  text: {
    color: "#F2F7F2",
    fontSize: 20,
    textAlign: "center",
    // fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
    fontWeight: "bold",
    textAlign: "center",
  },
});
