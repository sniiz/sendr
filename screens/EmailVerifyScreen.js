import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  // View,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import UIText from "../components/LocalizedText";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  // createUserWithEmailAndPassword,
  // updateProfile,
  signOut,
} from "../firebase";
// import { NavigationContainer } from "@react-navigation/native";

const version = require("../assets/version-info.json");

// TOOD make this screen look fancier
// a reload button maybe?
// how do u even do that with rn
export default React.memo(function EmailVerifyScreen({ navigation, route }) {
  const auth = getAuth();
  const [sent, setSent] = useState(false);
  const [tooLong, setTooLong] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      if (user?.emailVerified) {
        navigation.replace("home");
      }
    });
    const tooLongTimer = setTimeout(() => {
      setTooLong(true);
    }, 20000);
    return () => {
      unsub();
      clearTimeout(tooLongTimer);
    };
  }, [navigation]);

  useEffect(() => {
    const verifyChecker = setInterval(() => {
      console.log("checking");
      if (getAuth().currentUser?.emailVerified) {
        console.log("verified, redirecting");
        navigation.replace("home");
        clearInterval(verifyChecker);
      } else {
        console.log("not verified");
      }
    }, 2000);
    return () => {
      clearInterval(verifyChecker);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#0a0a0b" },
      headerTintColor: "#f4f5f5",
      headerLeft: () => null,
      headerTitleAlign: "center",
      title: UIText.emailVerifyScreen.barTitle,
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
        {UIText.emailVerifyScreen.title}{" "}
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
          backgroundColor: sent ? "#0a0a0b" : "#f4f5f5",
          borderRadius: 5,
          borderWidth: 2,
          borderColor: sent ? "#f4f5f5" : "#727178",
          padding: 10,
          paddingHorizontal: 20,
          marginBottom: 10,
          fontWeight: "800",
        }}
      >
        <Text
          style={[
            styles.text,
            {
              fontWeight: "800",
              color: sent ? "#f4f5f5" : "#0a0a0b",
            },
          ]}
        >
          {sent
            ? UIText.emailVerifyScreen.sentButton
            : UIText.emailVerifyScreen.verifyButton}
        </Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>
        {UIText.emailVerifyScreen.didNotReceiveEmail}
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
          borderColor: "#fa5f5f",
          backgroundColor: tooLong ? "#fa5f5f" : "#0a0a0b",
          marginTop: 100,
          padding: 10,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={[
            styles.text,
            {
              color: tooLong ? "#0a0a0b" : "#fa5f5f",
              // marginTop: 20,
              fontWeight: "800",
            },
          ]}
        >
          {UIText.settingsScreen.logOutButton}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0b",
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
    fontWeight: "bold",
  },
  title: {
    color: "#f4f5f5",
    fontSize: 40,
    marginBottom: 20,
    fontWeight: "800",
    textAlign: "center",
    overflow: "visible",
  },
  text: {
    color: "#f4f5f5",
    fontSize: 20,
    textAlign: "center",
    // fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
    fontWeight: "bold",
    textAlign: "center",
  },
});
