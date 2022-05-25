import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
  doc,
} from "../firebase";
import UIText from "../components/LocalizedText";
import Spinner from "react-native-loading-spinner-overlay";

// const logo = require("../assets/wip_logo_white.png");
const version = require("../assets/version-info.json");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [takingTooLong, setTakingTooLong] = useState(false);
  const [serverDown, setServerDown] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      if (user !== null) {
        setIsLoggedIn(true);
        getDoc(doc(collection(getFirestore(), "users"), user.uid)).then(
          (userdoc) => {
            if (!userdoc.exists()) {
              setDoc(doc(db, "users", user.id), {
                friendRequests: [],
                friends: [],
                name: user.displayName,
                pfp: user.photoURL ? user.photoURL : null,
                online: true,
              }).then(() => {
                navigation.replace("home");
              });
            } else {
              navigation.replace("home");
            }
          },
          (error) => {
            alert(error);
            navigation.replace("home");
          }
        );
      } else {
        setLoading(false);
        navigation.setOptions({
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
          headerLeft: () => null,
          gesturesEnabled: false,
          headerShown: true,
          headerTitleAlign: "center",
        });
      }
    });
    setTimeout(() => {
      setTakingTooLong(true);
      setTimeout(() => {
        setServerDown(true);
      }, 15000);
    }, 10000);
    return () => {
      unsub();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "black" },
      headerTintColor: "white",
      headerLeft: () => null,
      headerShown: false,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const signIn = () => {
    setLoggingIn(true);
    setPasswordCorrect(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoggingIn(false);
        navigation.replace("home");
      })
      .catch((error) => {
        setLoggingIn(false);
        if (error.message.includes("password")) {
          setPasswordCorrect(false);
        }
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={20} color="gray" />
        {takingTooLong && (
          <Text
            style={{
              color: "gray",
              fontSize: 20,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {serverDown
              ? "ok, at this point either your wifi is absolute garbo either our server is down. try restarting your router.\nif that doesn't work, you can email the lead dev at haley.sniiz@gmail.com and scream at her all you want."
              : "this is taking longer than it should... maybe try checking your internet or restarting the app"}
          </Text>
        )}
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        // FIXME occasionally glitches out on android
        behavior="height"
        style={styles.container}
        keyboardVerticalOffset={30}
      >
        <StatusBar style="light" />
        <Text style={[styles.version, { marginBottom: loading ? "70%" : 20 }]}>
          {version.number}
          {"\n"}✨ {version.name} ✨
        </Text>
        <Text style={styles.title}>{UIText["loginScreen"]["title"]}</Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder={UIText["loginScreen"]["emailPlaceholder"]}
            style={styles.input}
            autoFocus
            type="email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder={UIText["loginScreen"]["passwordPlaceholder"]}
            secureTextEntry
            type="password"
            style={[
              styles.input,
              {
                borderColor: passwordCorrect ? "white" : "red",
              },
            ]}
            value={password}
            placeholderTextColor="gray"
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={signIn}
          />
          <Text style={styles.errorText}>
            {passwordCorrect ? "" : UIText["loginScreen"]["passwordError"]}
          </Text>
        </View>

        <View style={styles.elbutton}>
          {loggingIn ? (
            <ActivityIndicator
              size="small"
              color="gray"
              style={{
                marginBottom: 20,
              }}
            />
          ) : (
            <TouchableOpacity
              onPress={signIn}
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "white",
                padding: 8,
                paddingHorizontal: 20,
                marginBottom: 20,
                marginTop: -10,
              }}
            >
              <Text style={styles.login}>
                {UIText["loginScreen"]["loginButton"]}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("signUp")}
            style={{
              // backgroundColor: "white",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "white",
              padding: 8,
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <Text style={styles.noacc}>
              {UIText["loginScreen"]["signUpButton"]}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  inputContainer: {
    width: 320,
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    color: "white",
    backgroundColor: "black",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: Platform.OS === "web" ? 0 : -15,
    textAlign: "center",
    fontStyle: "italic",
  },
  noacc: {
    color: "#f0f0f0",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "right",
    overflow: "visible",
  },
  main: {
    flex: 1,
    backgroundColor: "black",
  },
  login: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    overflow: "visible",
  },
  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "normal",
    textAlign: "center",
    overflow: "visible",
  },
  elbutton: {
    alignItems: "center",
    marginTop: Platform.OS === "web" ? 10 : 0,
  },
  version: {
    color: "gray",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  input: {
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    marginTop: 0,
    textAlign: "left",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "black",
  },
});

export default LoginScreen;
