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
      headerStyle: { backgroundColor: "#0a0a0a" },
      headerTintColor: "#F2F7F2",
      headerTitleAlign: "center",
      title: UIText["registerScreen"]["barTitle"],
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
      <Text style={styles.version}>
        {version.number}
        {"\n"}✨ {version.name} ✨
      </Text>
      <Header
        style={{
          color: "#F2F7F2",
          fontSize: 40,
          fontWeight: "bold",
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
          placeholderTextColor="#727178"
          value={fullname}
          onChangeText={(text) => setFullname(text)}
        />
        <Input
          placeholder={UIText["signUpScreen"]["emailPlaceholder"]}
          style={styles.input}
          type="email"
          placeholderTextColor="#727178"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder={UIText["signUpScreen"]["passwordPlaceholder"]}
          secureTextEntry
          style={styles.input}
          type="password"
          placeholderTextColor="#727178"
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
          color="#727178"
          style={{
            marginTop: -10,
            marginBottom: 20,
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={register}
          style={{
            backgroundColor: "#F2F7F2",
            borderRadius: 5,
            // borderWidth: 2,
            // borderColor: "#F2F7F2",
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
    // color: "#F2F7F2",
    color: "#0a0a0a",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    overflow: "visible",
  },
  input: {
    color: "#F2F7F2",
    borderWidth: 2,
    borderColor: "#F2F7F2",
    padding: 10,
    marginTop: Platform.OS === "web" ? 0 : -10,
    textAlign: "left",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingBottom: 10,
    backgroundColor: "#0a0a0a",
  },
});
