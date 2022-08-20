import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  // TouchableWithoutFeedback,
  Text,
  TextInput,
  Platform,
} from "react-native";
import { Header } from "../components/CustomUi";
import {
  getAuth,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  getFirestore,
  getDocs,
  query,
  updateProfile,
  where,
  collection,
  uploadBytes,
  getDownloadURL,
  getStorage,
  // } from Platform.OS === "web" ? "../firebase" : "../firebaseMobile";
} from "../firebase";
import UIText from "../components/LocalizedText";
import ActivityIndicator from "../components/ActivityIndicator";
import { deleteUser } from "firebase/auth";

const version = require("../assets/version-info.json");
const RegisterScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#0a0a0b" },
      headerTintColor: "#f4f5f5",
      headerTitleAlign: "center",
      title: UIText.signUpScreen.barTitle,
    });
  }, [navigation]);

  const generatePfp = async () => {
    // TODO
  };

  const register = () => {
    setLoading(true);
    const auth = getAuth();
    setEmail(email.trim());
    setPassword(password.trim());
    setFullname(fullname.trim());
    setPasswordConfirm(passwordConfirm.trim());
    if (fullname === "potat" || fullname === "POTATOCAT") {
      alert(
        "that username is reserved for system messages. please choose another" // TODO translate
      );
      return;
    }
    if (fullname.length < 3 || fullname.length > 15) {
      alert(`${fullname} ${UIText.settingsScreen.usernameTooLong}`);
      return;
    }
    if (password !== passwordConfirm) {
      alert(UIText.signUpScreen.passwordsDontMatch);
      setLoading(false);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
        getDocs(
          query(collection(db, "users"), where("name", "==", fullname))
        ).then((users) => {
          if (users.docs.length > 0) {
            deleteUser(user);
            setLoading(false);
            alert(UIText.signUpScreen.taken);
            return;
          } else {
            updateProfile(user, {
              displayName: fullname,
              // photoURL: imgurl,
            })
              .then(() => {
                setDoc(doc(db, "users", user.uid), {
                  friendRequests: [],
                  friends: [],
                  name: fullname,
                  pfp: null,
                  online: true,
                }).then(() => {
                  setLoading(false);
                  navigation.navigate("verifyEmail");
                });
              })
              .catch((error) => {
                setLoading(false);
                // console.log(error.message);
              });
          }
        });
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.version}>
        {version.number}
        {"\n"}✨ {version.name} ✨
      </Text>
      <Header
        style={{
          color: "#f4f5f5",
          fontSize: 40,
          fontWeight: "800",
          textAlign: "center",
          overflow: "visible",
          marginBottom: 25,
        }}
      >
        {UIText.signUpScreen.title}
      </Header>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder={UIText.signUpScreen.nicknamePlaceholder}
          autoFocus
          style={styles.input}
          type="text"
          placeholderTextColor="#727178"
          value={fullname}
          onChangeText={(text) => setFullname(text)}
        />
        <TextInput
          placeholder={UIText.signUpScreen.emailPlaceholder}
          style={styles.input}
          type="email"
          placeholderTextColor="#727178"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder={UIText.signUpScreen.passwordPlaceholder}
          secureTextEntry
          style={styles.input}
          type="password"
          placeholderTextColor="#727178"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          placeholder={UIText.signUpScreen.confirmPasswordPlaceholder}
          secureTextEntry
          style={styles.input}
          type="password"
          placeholderTextColor="#727178"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(text)}
          onSubmitEditing={register}
        />
      </View>
      <Text
        style={[
          styles.version,
          {
            marginTop: Platform.OS === "web" ? -5 : -15,
            fontSize: 13,
          },
        ]}
      >
        {UIText.signUpScreen.disclaimer}
      </Text>

      {loading ? (
        <ActivityIndicator
          size={10}
          color="#f4f5f5"
          style={{
            marginTop: -10,
            marginBottom: 20,
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={register}
          style={{
            backgroundColor: "#f4f5f5",
            borderRadius: 5,
            // borderWidth: 2,
            // borderColor: "#f4f5f5",
            padding: 8,
            paddingHorizontal: 20,
            marginBottom: 20,
            marginTop: -10,
            marginBottom: 20,
          }}
        >
          <Text style={styles.login}>{UIText.signUpScreen.signUpButton}</Text>
        </TouchableOpacity>
      )}
      {/* <View style={{ height: 1 }} /> */}
    </KeyboardAvoidingView>
  );
};

export default React.memo(RegisterScreen);

const styles = StyleSheet.create({
  ImageDimension: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    width: 320,
    marginVertical: 10,
  },
  version: {
    color: "#727178",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
  },
  issue: {
    color: "#fa5f5f",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  login: {
    // color: "#f4f5f5",
    color: "#0a0a0b",
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    overflow: "visible",
  },
  input: {
    color: "#f4f5f5",
    borderWidth: 2,
    // outlineStyle: "none", // doesn't work on ios for some reason - bummer
    borderColor: "#f4f5f5",
    padding: 10,
    marginTop: Platform.OS === "web" ? 0 : -10,
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: Platform.OS === "web" ? 10 : 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingBottom: 10,
    backgroundColor: "#0a0a0b",
  },
});
