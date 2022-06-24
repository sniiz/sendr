import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
// import { CoolButton } from "../components/CustomUi";
import { collection, addDoc, getFirestore, getAuth } from "../firebase";
import UIText from "../components/LocalizedText";

const AddChatScreen = ({ navigation }) => {
  const [chat, setChat] = useState("");
  const [chatId, setChatId] = useState("");

  const [loading, setLoading] = useState(false);

  const createChat = () => {
    const db = getFirestore();
    const auth = getAuth();
    addDoc(collection(db, "privateChats"), {
      chatName: chat,
      author: auth.currentUser.displayName,
      members: [auth.currentUser.uid],
      dm: false,
    })
      .then((ref) =>
        navigation.navigate("chat", {
          id: ref.id,
          chatName: chat,
          author: auth.currentUser.displayName,
        })
      )
      .catch((error) => alert(error.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: UIText["newChatScreen"]["barTitle"],
      headerStyle: { backgroundColor: "#0a0a0a" },
      headerTintColor: "#F2F7F2",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TextInput
        placeholder={UIText["newChatScreen"]["chatNamePlaceholder"]}
        value={chat}
        style={styles.input}
        placeholderTextColor="#727178"
        onChangeText={(text) => setChat(text)}
        onSubmitEditing={createChat}
      />
      <TouchableOpacity
        onPress={createChat}
        style={{
          borderRadius: 5,
          borderWidth: 2,
          borderColor: "#F2F7F2",
          backgroundColor: chat ? "#F2F7F2" : "#0a0a0a",
          padding: 8,
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={[
            styles.button,
            {
              color: chat ? "#0a0a0a" : "#F2F7F2",
            },
          ]}
        >
          {UIText["newChatScreen"]["create"]} ✍️
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default React.memo(AddChatScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    padding: 30,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 90,
    flex: 1,
    height: "100%",
  },
  input: {
    color: "#F2F7F2",
    borderWidth: 2,
    borderColor: "#F2F7F2",
    padding: 10,
    marginTop: 0,
    // alignSelf: "center",
    textAlign: "left",
    width: "60%",
    // maxWidth: 300,
    // fontFamily: "regular",
    outlineStyle: "none", // doesn't work on ios for some reason - bummer
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 20,
  },
  inputContainer: {
    width: 320,
    marginVertical: 10,
  },
  button: {
    color: "#F2F7F2",
    fontSize: 25,
    // marginTop: -10,
    fontWeight: "800",
    // fontFamily:old",
    textAlign: "center",
    overflow: "visible",
  },
});
