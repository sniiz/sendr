import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  // TouchableWithoutFeedback,
  // TouchableHighlight,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  getFirestore,
  // collection,
  // addDoc,
  setDoc,
  getDoc,
  doc,
  // } from Platform.OS === "web" ? "../firebase" : "../firebaseMobile";
} from "../firebase";
import UIText from "../components/LocalizedText";
// import { Storage } from "expo-storage";
import ActivityIndicator from "../components/ActivityIndicator";

// const logo = require("../assets/wip_logo_#f4f5f5.png");
const version = require("../assets/version-info.json");

const LoginScreen = ({ navigation }) => {
  try {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCorrect, setPasswordCorrect] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loggingIn, setLoggingIn] = useState(false);
    const [takingTooLong, setTakingTooLong] = useState(false);

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
      // if (getAuth().currentUser) {
      //   // console.log("LOGGED IN");
      //   setIsLoggedIn(true);
      //   getDoc(doc(db, `users`, user.uid)).then(
      //     (userdoc) => {
      //       if (!userdoc.exists()) {
      //         setDoc(doc(db, "users", user.id), {
      //           friendRequests: [],
      //           friends: [],
      //           name: user.displayName,
      //           pfp: user.photoURL ? user.photoURL : null,
      //           online: true,
      //         }).finally(() => {
      //           navigation.replace("home");
      //         });
      //       } else {
      //         navigation.replace("home");
      //       }
      //     },
      //     (error) => {
      //       alert(error);
      //       navigation.replace("home");
      //
      //   );
      // }
      const unsub = onAuthStateChanged(getAuth(), (user) => {
        if (user !== null) {
          // console.log(user);
          getDoc(doc(db, `users`, user.uid)).then(
            async (userdoc) => {
              if (!userdoc?.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                  friendRequests: [],
                  friends: [],
                  name: user.displayName,
                  pfp: user.photoURL ? user.photoURL : null,
                  online: true,
                  status: "",
                }).catch((e) => {
                  alert(e);
                  navigation.replace("home");
                });
                navigation.replace("home");
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
            headerStyle: { backgroundColor: "#0a0a0b" },
            headerTintColor: "#f4f5f5",
            headerLeft: () => null,
            gesturesEnabled: false,
            headerShown: true,
            headerTitleAlign: "center",
          });
        }
      });
      const tooLong = setTimeout(() => {
        setTakingTooLong(true);
      }, 20000);
      return () => {
        unsub();
        clearTimeout(tooLong);
      };
    }, []);

    useLayoutEffect(() => {
      navigation.setOptions({
        headerStyle: { backgroundColor: "#0a0a0b" },
        headerTintColor: "#f4f5f5",
        headerLeft: () => null,
        headerShown: false,
        headerTitleAlign: "center",
        title: UIText.loginScreen.barTitle,
      });
    }, [navigation]);

    const signIn = () => {
      setLoggingIn(true);
      setPasswordCorrect(true);
      setEmail(email.trim());
      setPassword(password.trim());
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setLoggingIn(false);
          if (Platform.OS === "web" && navigator?.userAgent?.match(/safari/i))
            // alert(
            //   "it looks like you're using an apple device. please beware that due to the way webkit works the chat scrolling may be reversed. (we will not show this message again)"
            // );
            navigation.replace("home");
        })
        .catch((error) => {
          setLoggingIn(false);
          if (error.message.includes("password")) {
            setPasswordCorrect(false);
          } else alert(error);
        });
    };

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={20} color="#f4f5f5" />
          {takingTooLong && (
            <Text
              style={{
                color: "#f4f5f5",
                fontSize: 20,
                marginTop: 10,
                marginBottom: -30,
                textAlign: "center",
                paddingHorizontal: 10,
                fontWeight: "400",
              }}
            >
              {/* {serverDown
              ? "ok, at this point either your wifi is absolute garbo either our server is down. try restarting your router.\nif that doesn't work, you can email the lead dev at haley.sniiz@gmail.com and scream at her all you want." */}
              hmm... this is taking longer than it should. try checking your
              internet or restarting the app.
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
          <Text
            style={[styles.version, { marginBottom: loading ? "70%" : 20 }]}
          >
            v{version.number}
            {"\n"}build {version.build}
            {"\n"}✨ {version.name} ✨
          </Text>
          <Text style={styles.title}>{UIText.loginScreen.title}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={UIText.loginScreen.emailPlaceholder}
              style={styles.input}
              autoFocus
              type="email"
              placeholderTextColor="#727178"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              placeholder={UIText.loginScreen.passwordPlaceholder}
              secureTextEntry
              type="password"
              style={[
                styles.input,
                {
                  borderColor: passwordCorrect ? "#f4f5f5" : "#fa5f5f",
                },
              ]}
              value={password}
              placeholderTextColor="#727178"
              onChangeText={(text) => setPassword(text)}
              onSubmitEditing={signIn}
            />
            <Text style={styles.errorText}>
              {passwordCorrect ? "" : UIText.loginScreen.passwordError}
            </Text>
          </View>

          <View style={styles.elbutton}>
            {loggingIn ? (
              <ActivityIndicator
                size={20}
                color="#f4f5f5"
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
                  // borderColor: "#f4f5f5",
                  backgroundColor: "#f4f5f5",
                  padding: 8,
                  paddingHorizontal: 20,
                  marginBottom: 20,
                  marginTop: -10,
                }}
              >
                <Text style={styles.login}>
                  {UIText.loginScreen.loginButton}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate("signUp")}
              style={{
                // backgroundColor: "#f4f5f5",
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "#f4f5f5",
                padding: 8,
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <Text style={styles.noacc}>
                {UIText.loginScreen.signUpButton}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    }
  } catch (e) {
    alert(e);
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
    color: "#f4f5f5",
    backgroundColor: "#0a0a0b",
    fontWeight: "bold",
  },
  errorText: {
    color: "#fa5f5f",
    fontSize: 12,
    marginTop: Platform.OS === "web" ? 0 : -15,
    textAlign: "center",
    fontStyle: "italic",
  },
  noacc: {
    color: "#f0f0f0",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "right",
    overflow: "visible",
  },
  main: {
    flex: 1,
    backgroundColor: "#0a0a0b",
  },
  login: {
    // color: "#f4f5f5",
    color: "#0a0a0b",
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    overflow: "visible",
  },
  title: {
    color: "#f4f5f5",
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
    color: "#f4f5f5",
    borderWidth: 2,
    borderColor: "#f4f5f5",
    padding: 10,
    marginTop: 0,
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: Platform.OS === "web" ? 10 : 20,
    fontSize: 20,
    // outlineStyle: "none", // doesn't work on ios for some reason - bummer
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#0a0a0b",
  },
});

export default React.memo(LoginScreen);
