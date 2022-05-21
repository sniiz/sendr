import { SimpleLineIcons } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  View,
} from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import UIText from "../components/LocalizedText";
import {
  addDoc,
  collection,
  getAuth,
  getFirestore,
  onSnapshot,
  orderBy,
  onAuthStateChanged,
  sendEmailVerification,
  getDoc,
  query,
  serverTimestamp,
  doc,
} from "../firebase";
import isMobile from "react-device-detect";
import { useKeyboard } from "@react-native-community/hooks";
import { Popable, Popover } from "react-native-popable";
import FastList from "../components/FastList";

const ChatScreen = ({ navigation, route }) => {
  const [msgInput, setMsgInput] = useState("");
  const [author, setAuthor] = useState("");

  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [members, setMembers] = useState([]);
  const [devs, setDevs] = useState([]);

  const [sending, setSending] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [repliedId, setRepliedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const flatListRef = useRef(null);

  const kb = useKeyboard();

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `privateChats/${route.params.id}`, "messages"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setMessages(messages);
      }
    );
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace("login");
      } else if (!user?.emailVerified) {
        navigation.replace("verifyEmail");
      }
    });
    getDoc(doc(db, `privateChats`, route.params.id)).then((chat) => {
      setAuthor(chat.data().author);
      // load chat members and retrieve their names
      const members = [];
      chat.data().members.forEach((member) => {
        getDoc(doc(db, `users`, member)).then((user) => {
          members.push({
            id: member,
            name: member === auth.currentUser.uid ? "you" : user.data().name,
          });
          setMembers(members);
          console.log(members);
        });
      });
      setLoaded(true);
    });
    getDoc(doc(db, "otherStuff", "devs")).then((devs) => {
      setDevs(devs.data().ids);
      console.log(devs.data().ids);
    });
    return () => {
      unsubscribe();
      unsubAuth();
    };
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // title: route.params.chatName,
      headerStyle: {
        backgroundColor: "black",
        borderBottomWidth: 1,
        borderBottomColor: "white",
      },
      // headerTitleStyle: { color: "white" },
      headerTintColor: "white",
      // headerTitleAlign: "center",
      headerTitle: () => {
        return (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
              }}
            >
              {route.params.chatName}
            </Text>
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            > */}
            <Text
              style={{
                fontSize: 12,
                color: "white",
              }}
            >
              {members.map((member) => member.name).join(", ")}
            </Text>
            {/* </View> */}
          </View>
        );
      },
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("chatSettings", {
                id: route.params.id,
                chatName: route.params.chatName,
              });
            }}
            style={{
              padding: 10,
              marginRight: 5,
            }}
          >
            <SimpleLineIcons name="options-vertical" size={20} color="gray" />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);
  const sendMsg = () => {
    if (!editingId) {
      Keyboard.dismiss();
      setSending(true);

      if (msgInput.trim().length > 0 && msgInput.trim().length <= 1000) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            timestamp: serverTimestamp(),
            message: msgInput,
            displayName: auth.currentUser.displayName,
            // email: auth.currentUser.email,
            uid: auth.currentUser.uid,
            // referenceId: repliedId,
          },
        ]);
        setMsgInput("");
        setEditingId(null);
        addDoc(collection(db, `privateChats/${route.params.id}`, "messages"), {
          timestamp: serverTimestamp(),
          message: msgInput,
          displayName: auth.currentUser.displayName,
          // email: auth.currentUser.email,
          uid: auth.currentUser.uid,
          // referenceId: repliedId,
          photoURL:
            auth.currentUser.photoURL || "https://i.imgur.com/dA9mtkT.png",
        })
          .then(() => {
            setSending(false);
            setRepliedId(null);
          })
          .catch((error) => alert(error.message));
      } else {
        setSending(false);
        setRepliedId(null);
      }
    } else {
      // wip
    }
  };

  const messageItem = ({ item }) => {
    const isUser =
      item.uid === auth?.currentUser?.uid ||
      item.email === auth?.currentUser?.email;
    const main = isUser ? "white" : "black";
    const second = isUser ? "black" : "white";
    const third = isUser ? "#999" : "#555";
    if (item.message.trim() === "") {
      return null;
    }
    return (
      <View
        key={item.id}
        style={{
          alignItems: "center",
          flexDirection: "row",
          borderTopColor: third,
          borderTopWidth: 1,
          backgroundColor: main,
        }}
      >
        <Image
          source={{
            uri: item.photoURL || "https://i.imgur.com/dA9mtkT.png",
          }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 20,
            margin: 5,
            marginHorizontal: 10,
          }}
        />
        <View style={[styles.messageView, { backgroundColor: main }]}>
          <Text style={[styles.senderName]}>
            {item.displayName}
            {devs?.includes(item.uid) && (
              <View
                style={{
                  backgroundColor: "#55f",
                  // // width: "auto",
                  padding: 5,
                  paddingVertical: 3,
                  borderRadius: 7,
                  marginLeft: 3,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 7,
                  }}
                >
                  DEV
                </Text>
              </View>
            )}
            {/* {
                                devs.includes(item.uid) && " · " // garbo
                            } */}
            {" · "}
            {new Date(item?.timestamp?.seconds * 1000).toLocaleDateString(
              Localization.locale,
              {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }
            )}
          </Text>
          <Text style={[styles.receiverText, { color: second }]}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  const keyExtractor = (item) => item.id;

  const createdHeader = (
    <Text
      style={{
        fontSize: 15,
        fontWeight: "bold",
        color: "gray",
        textAlign: "center",
        marginVertical: 10,
      }}
    >
      {author}
      {UIText["chatScreen"]["created"]}
      {route.params.chatName}
    </Text>
  );

  const scrollToEnd = () => {
    flatListRef.current.scrollToEnd({
      animated: true,
    });
  };

  if (!loaded) {
    return (
      <View
        style={{
          backgroundColor: "black",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            {messages.length !== 0 ? (
              <FlatList
                data={messages}
                ref={flatListRef}
                keyExtractor={keyExtractor}
                ListHeaderComponent={createdHeader}
                onContentSizeChange={scrollToEnd}
                windowSize={11}
                renderItem={messageItem}
              />
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "black",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    // fontWeight: "bold",
                    color: "gray",
                    textAlign: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                    }}
                  >
                    {"|^・ω・)/\n\n"}
                  </Text>
                  {UIText["chatScreen"]["saysth"]}
                </Text>
              </View>
            )}
            <View style={styles.footer}>
              <TextInput
                placeholder={UIText["chatScreen"]["inputPlaceholder"]}
                textContentType="none"
                placeholderTextColor="grey"
                style={styles.textInput}
                value={msgInput}
                // autoFocus
                onChangeText={(text) => setMsgInput(text)}
                onSubmitEditing={sendMsg}
                autoCorrect={false}
              />
              {sending ? (
                <Popable
                  content={
                    <View style={styles.popupContainer}>
                      <Text style={styles.popupText}>
                        {UIText["chatScreen"]["sending"]}
                      </Text>
                    </View>
                  }
                  action="hover"
                  style={{ opacity: 0.8 }}
                  position="left"
                >
                  <ActivityIndicator
                    size="small"
                    color="gray"
                    style={{ marginLeft: 15 }}
                  />
                </Popable>
              ) : msgInput !== "" && msgInput.length <= 1000 ? (
                <Popable
                  content={
                    <View style={styles.popupContainer}>
                      <Text style={styles.popupText}>
                        {UIText["chatScreen"]["send"]}
                      </Text>
                    </View>
                  }
                  action="hover"
                  style={{ opacity: 0.8 }}
                  position="left"
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{ marginLeft: 15 }}
                    onPress={sendMsg}
                  >
                    <SimpleLineIcons
                      name="paper-plane"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </Popable>
              ) : (
                <Popable
                  content={
                    <View style={styles.popupContainer}>
                      <Text style={styles.popupText}>
                        {msgInput.length > 1000 &&
                          UIText["chatScreen"]["tooLong"]}
                      </Text>
                    </View>
                  }
                  action="hover"
                  style={{ opacity: 0.8 }}
                  position="left"
                >
                  <SimpleLineIcons
                    name="paper-plane"
                    size={20}
                    color="#444"
                    style={{ marginLeft: 15 }}
                  />
                </Popable>
              )}
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  // a ton of these styles are probably unnecessary but idc
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  replyFooter: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    paddingVertical: 10,
  },
  textInput: {
    // bottom: 0,
    height: 40,
    flex: 1,
    // marginRight: 15,
    padding: 10,
    color: "white",
    borderWidth: 1,
    borderColor: "white",
  },
  receiverText: {
    color: "black",
    fontWeight: "normal",
    maxWidth: "95%",
  },
  createdText: {
    color: "grey",
    // fontWeight: "light",
    textAlign: "center",
    marginVertical: 15,
    alignSelf: "center",
  },
  sendbutton: {
    color: "white",
    marginLeft: 15,
  },
  senderText: {
    color: "white",
    fontWeight: "normal",
    // marginLeft: 10,
    // marginBottom: 15,
  },
  messageView: {
    padding: 15,
    paddingLeft: 5,
    // paddingLeft: 30,
    // backgroundColor: "white",
    alignItems: "flex-start",
    width: "100%",
    marginVertical: 0,
    position: "relative",
  },
  senderName: {
    // left: 10,
    // paddingRight: 10,
    marginLeft: -5,
    fontSize: 10,
    color: "grey",
    alignItems: "center",
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "black",
    paddingVertical: "10%",
    paddingHorizontal: "5%",
  },
  popupText: {
    color: "white",
    fontSize: 12,
  },
});
