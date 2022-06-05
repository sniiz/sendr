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
import { Storage } from "expo-storage";

// const logo = require("../assets/wip_logo_#F2F7F2.png");
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
        // console.log(user);
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
          headerStyle: { backgroundColor: "#0a0a0a" },
          headerTintColor: "#F2F7F2",
          headerLeft: () => null,
          gesturesEnabled: false,
          headerShown: true,
          headerTitleAlign: "center",
        });
      }
    });
    // setTimeout(() => {
    //   setTakingTooLong(true);
    //   setTimeout(() => {
    //     setServerDown(true);
    //   }, 15000);
    // }, 10000);
    return () => {
      unsub();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#0a0a0a" },
      headerTintColor: "#F2F7F2",
      headerLeft: () => null,
      headerShown: false,
      headerTitleAlign: "center",
      title: UIText["loginScreen"]["barTitle"],
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
        <ActivityIndicator size={20} color="#727178" />
        {takingTooLong && (
          <Text
            style={{
              color: "#727178",
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
            placeholderTextColor="#727178"
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
                borderColor: passwordCorrect ? "#F2F7F2" : "red",
              },
            ]}
            value={password}
            placeholderTextColor="#727178"
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
              color="#727178"
              style={{
                marginBottom: 20,
              }}
            />
          ) : (
            <TouchableOpacity
              onPress={signIn}
              style={{
                borderRadius: 5,
                // borderWidth: 2,
                // borderColor: "#F2F7F2",
                backgroundColor: "#F2F7F2",
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
              // backgroundColor: "#F2F7F2",
              borderRadius: 5,
              borderWidth: 2,
              borderColor: "#F2F7F2",
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
    color: "#F2F7F2",
    backgroundColor: "#0a0a0a",
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
    backgroundColor: "#0a0a0a",
  },
  login: {
    // color: "#F2F7F2",
    color: "#0a0a0a",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    overflow: "visible",
  },
  title: {
    color: "#F2F7F2",
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    overflow: "visible",
  },
  elbutton: {
    alignItems: "center",
    marginTop: Platform.OS === "web" ? 10 : 0,
  },
  version: {
    color: "#727178",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  input: {
    color: "#F2F7F2",
    borderWidth: 2,
    borderColor: "#F2F7F2",
    padding: 10,
    marginTop: 0,
    textAlign: "left",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#0a0a0a",
  },
});

export default React.memo(LoginScreen);
