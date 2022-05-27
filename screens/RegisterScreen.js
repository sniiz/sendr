import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Header } from "../components/CustomUi";
import { Button, Input, Text } from "react-native-elements";
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
} from "../firebase";
import UIText from "../components/LocalizedText";

const version = require("../assets/version-info.json");
const RegisterScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imgurl, setImgurl] = useState("");

  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "black" },
      headerTintColor: "white",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const register = () => {
    if (fullname === "potat") {
      alert(
        "that username is reserved for system messages. please choose another"
      );
      return;
    }
    setLoading(true);
    const auth = getAuth();
    setEmail(email.trim());
    setPassword(password.trim());
    setFullname(fullname.trim());
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
        getDocs(
          query(collection(db, "users"), where("name", "==", fullname))
        ).then((users) => {
          if (users.length > 0) {
            setLoading(false);
            alert(UIText["signUpScreen"]["taken"]);
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
                  pfp: imgurl ? imgurl : null,
                  online: true,
                }).then(() => {
                  setLoading(false);
                  navigation.navigate("verifyEmail");
                });
              })
              .catch((error) => {
                setLoading(false);
                console.log(error.message);
              });
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar />
      <Text style={styles.version}>
        {version.number}
        {"\n"}✨ {version.name} ✨
      </Text>
      <Header
        style={{
          color: "white",
          fontSize: 40,
          fontWeight: "normal",
          textAlign: "center",
          overflow: "visible",
          marginBottom: 25,
        }}
      >
        {UIText["signUpScreen"]["title"]}
      </Header>

      <View style={styles.inputContainer}>
        <Input
          placeholder={UIText["signUpScreen"]["nicknamePlaceholder"]}
          autoFocus
          style={styles.input}
          type="text"
          placeholderTextColor="gray"
          value={fullname}
          onChangeText={(text) => setFullname(text)}
        />
        <Input
          placeholder={UIText["signUpScreen"]["emailPlaceholder"]}
          style={styles.input}
          type="email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder={UIText["signUpScreen"]["passwordPlaceholder"]}
          secureTextEntry
          style={styles.input}
          type="password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={(text) => setPassword(text)}
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
        {UIText["signUpScreen"]["disclaimer"]}
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="gray"
          style={{
            marginTop: -10,
            marginBottom: 20,
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={register}
          style={{
            // backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "white",
            padding: 8,
            paddingHorizontal: 20,
            marginBottom: 20,
            marginTop: -10,
            marginBottom: 20,
          }}
        >
          <Text style={styles.login}>
            {UIText["signUpScreen"]["signUpButton"]}
          </Text>
        </TouchableOpacity>
      )}
      {/* <View style={{ height: 1 }} /> */}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
    color: "gray",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
  },
  issue: {
    color: "red",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  login: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    overflow: "visible",
  },
  input: {
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    marginTop: Platform.OS === "web" ? 0 : -10,
    textAlign: "left",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingBottom: 10,
    backgroundColor: "black",
  },
});
