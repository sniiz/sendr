import { SimpleLineIcons } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
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
import UIText from "../components/LocalizedText";
import {
  addDoc,
  collection,
  getAuth,
  getFirestore,
  onSnapshot,
  orderBy,
  onAuthStateChanged,
  updateDoc,
  sendEmailVerification,
  getDoc,
  query,
  serverTimestamp,
  doc,
  deleteDoc,
  limit,
} from "../firebase";
import ActivityIndicator from "../components/ActivityIndicator";
import isMobile from "react-device-detect";
import { useKeyboard } from "@react-native-community/hooks";
import { Popable } from "react-native-popable";
// import Clipboard from "@react-native-clipboard/clipboard";
import * as Clipboard from "expo-clipboard";
import { TouchableHighlight } from "react-native-gesture-handler";
import Theme from "../components/themes";
// import HyperLink from "react-native-hyperlink";

const ChatScreen = ({ navigation, route }) => {
  const [msgInput, setMsgInput] = useState("");
  const [author, setAuthor] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [chatName, setChatName] = useState("");

  // const [messagesToLoad, setMessagesToLoad] = useState(20);

  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [members, setMembers] = useState([]);
  const [devs, setDevs] = useState([]);

  const [sending, setSending] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dm, setDm] = useState(false);

  const [repliedId, setRepliedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const flatListRef = useRef(null);

  const leaveMessages = [
    "left :(",
    "left",
    "left the chat",
    "went away :(",
    "left us",
    "left us :(",
  ];

  const j = "TVeHDZSeiGNVN2gYmvkDDv2uCaN2";

  const kb = useKeyboard();

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `privateChats/${route.params.id}`, "messages"),
        orderBy("timestamp", "desc")
        // limit(messagesToLoad)
      ),
      (snapshot) => {
        const messagesList = [];
        const docs = snapshot.docs;
        for (let i = 0; i < docs.length; i++) {
          messagesList.push({
            id: docs[i].id,
            ...docs[i].data(),
          });
        }
        setMessages(messagesList);
        // this.flatListRef.current.scrollToEnd();
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
      setChatName(chat.data().chatName);
      // load chat members and retrieve their names
      const members = [];
      for (let member of chat.data().members) {
        getDoc(doc(db, `users/${member}`)).then((user) => {
          members.push({
            id: member,
            name:
              user?.data()?.name === auth.currentUser.displayName
                ? UIText["chatScreen"]["you"]
                : user?.data()?.name,
          });
          setMembers(members);
        });
      }
      setDm(chat.data().dm);
      if (chat.data().dm) {
        const otherUserId = chat
          .data()
          .members.filter((member) => member !== auth.currentUser.uid);
        getDoc(doc(db, `users`, otherUserId[0])).then((user) => {
          setOtherUser(user.data().name);
        });
      }
      setLoaded(true);
    });
    getDoc(doc(db, "otherStuff", "devs")).then((devs) => {
      setDevs(devs.data().ids);
      // console.log(devs.data().ids);
    });
    return () => {
      unsubscribe();
      unsubAuth();
    };
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        route.params?.chatName !== null ? route.params.chatName : otherUser,
      headerStyle: {
        backgroundColor: "#0a0a0a",
        borderBottomWidth: 2,
        borderBottomColor: "#F2F7F2",
      },
      // headerTitleStyle: { color: "#F2F7F2", fontWeight: "bold" },
      headerTintColor: "#F2F7F2",
      headerRight: () => {
        if (dm || !loaded) {
          return null;
        }
        return (
          <View
            style={{
              marginRight: 20,
              width: 120,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Popable
              content={
                <View style={styles.popupContainer}>
                  <Text style={styles.popupText}>
                    {UIText["chatScreen"]["copyChatId"]}
                  </Text>
                </View>
              }
              action="hover"
              style={{ opacity: 0.8 }}
              position="bottom"
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  Clipboard.setString(route.params.id);
                }}
              >
                <SimpleLineIcons name="docs" size={18} color="#F2F7F2" />
              </TouchableOpacity>
            </Popable>
            <Popable
              content={
                <View style={styles.popupContainer}>
                  <Text style={styles.popupText}>
                    {UIText["chatScreen"]["exit"]}
                  </Text>
                </View>
              }
              action="hover"
              style={{ opacity: 0.8 }}
              position="bottom"
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  addDoc(
                    collection(
                      db,
                      `privateChats/${route.params.id}`,
                      "messages"
                    ),
                    {
                      timestamp: serverTimestamp(),
                      message: `${getAuth().currentUser.displayName} ${
                        leaveMessages[
                          Math.floor(Math.random() * leaveMessages.length)
                        ]
                      }`,
                      displayName: "potat",
                      uid: "POTATOCAT",
                      photoURL: "https://i.imgur.com/UFr7hCb.png",
                    }
                  );
                  updateDoc(doc(db, `privateChats`, route.params.id), {
                    members: members.filter(
                      (member) => member.id !== auth.currentUser.uid
                    ),
                  });
                  if (members.length === 1) {
                    deleteDoc(doc(db, `privateChats`, route.params.id));
                  }
                  navigation.replace("home");
                }}
              >
                <SimpleLineIcons name="logout" size={18} color="#F2F7F2" />
              </TouchableOpacity>
            </Popable>
          </View>
        );
      },
    });
    var colors = Theme.get();
    console.log(colors);
  }, [navigation, dm, otherUser, loaded]);
  const sendMsg = () => {
    Keyboard.dismiss();
    setSending(true);

    if (msgInput.trim().length > 0 && msgInput.trim().length <= 1000) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          timestamp: null,
          message: msgInput.trim(),
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
        message: msgInput.trim(),
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
  };

  const messageItem = ({ item }) => {
    const isUser =
      item.uid === auth?.currentUser?.uid ||
      item.email === auth?.currentUser?.email;
    const main = isUser ? "#F2F7F2" : "#0a0a0a";
    const second = isUser ? "#0a0a0a" : "#F2F7F2";
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
        {/* <TouchableOpacity
          onPress={() => {
            if (item.uid === auth.currentUser.uid) {
              navigation.navigate("settings");
            } else {
              navigation.navigate("friends", {
                friendId: item.uid,
              });
            }
          }}
        > */}
        <Image
          source={{
            uri: item.photoURL || "https://i.imgur.com/dA9mtkT.png",
          }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 20,
            margin: 5,
            marginLeft: 10,
          }}
        />
        {/* </TouchableOpacity> */}
        <View style={[styles.messageView, { backgroundColor: main }]}>
          <Text style={[styles.senderName]}>
            {item.displayName}
            {devs?.includes(item.uid) ? (
              <View
                style={{
                  backgroundColor: "#55f",
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
                    color: "#F2F7F2",
                    fontWeight: "800",
                    fontSize: 7,
                  }}
                >
                  DEV
                </Text>
              </View>
            ) : null}
            {item.uid === "POTATOCAT" ? (
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
                    color: "#F2F7F2",
                    fontWeight: "800",
                    fontSize: 7,
                  }}
                >
                  SYSTEM
                </Text>
              </View>
            ) : null}
            {item.uid === j ? (
              <View
                style={{
                  backgroundColor: "#ffd22e",
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
                    color: "#0a0a0a",
                    fontWeight: "800",
                    fontSize: 7,
                  }}
                >
                  lord sex
                </Text>
              </View>
            ) : null}
            {" · "}
            {item.timestamp
              ? new Date(item.timestamp.seconds * 1000).toLocaleDateString(
                  Localization.locale,
                  {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }
                )
              : "loading..."}
          </Text>
          <Text
            style={[
              styles.receiverText,
              {
                color: item.timestamp ? second : third,
                fontStyle: item.uid === "POTATOCAT" ? "italic" : "normal",
              },
            ]}
          >
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  const keyExtractor = (item) => item.id;

  const loadMore = () => {
    setMessagesToLoad(messagesToLoad + 20);
    console.log("load more");
    console.log(messagesToLoad);
  };

  const createdHeader = (
    <Text
      style={{
        fontSize: 15,
        fontWeight: "bold",
        color: "#727178",
        textAlign: "center",
        marginVertical: 10,
      }}
    >
      {dm
        ? `${otherUser}${UIText["chatScreen"]["friends"]}`
        : `${author}${UIText["chatScreen"]["created"]}${chatName}`}
    </Text>
  );

  const scrollToBottom = () => {
    // flatListRef.current.scrollToOffset({
    //   animated: true,
    //   offset: 0,
    // });
    // flatListRef.current.scrollToEnd({ animated: true });
  };

  if (!loaded) {
    return (
      <View
        style={{
          backgroundColor: "#0a0a0a",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={20} color="#727178" />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0a0a0a",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            {messages.length !== 0 ? (
              <FlatList
                data={messages}
                ref={flatListRef}
                keyExtractor={keyExtractor}
                ListFooterComponent={createdHeader}
                // ListHeaderComponent={createdHeader}
                onContentSizeChange={scrollToBottom}
                // windowSize={21}
                renderItem={messageItem}
                inverted
                // onEndReached={loadMore}
              />
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "#0a0a0a",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    // fontWeight: "bold",
                    color: "#727178",
                    textAlign: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                    }}
                  >
                    {"|^・w・)/\n\n"}
                  </Text>
                  {UIText["chatScreen"]["saysth"]}
                </Text>
              </View>
            )}
            <View style={styles.footer}>
              <TextInput
                placeholder={UIText["chatScreen"]["inputPlaceholder"]}
                textContentType="none"
                placeholderTextColor="#727178"
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
                  position="top"
                >
                  <ActivityIndicator
                    size="small"
                    color="#727178"
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
                  position="top"
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{ marginLeft: 15 }}
                    onPress={sendMsg}
                  >
                    <SimpleLineIcons
                      name="paper-plane"
                      size={20}
                      color="#F2F7F2"
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
                  position="top"
                >
                  <SimpleLineIcons
                    name="paper-plane"
                    size={20}
                    color="#445"
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

export default React.memo(ChatScreen);

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
    color: "#F2F7F2",
    borderWidth: 2,
    borderColor: "#F2F7F2",
    fontWeight: "bold",
  },
  receiverText: {
    fontWeight: "600",
    maxWidth: "90%",
  },
  createdText: {
    color: "#727178",
    // fontWeight: "light",
    textAlign: "center",
    marginVertical: 15,
    alignSelf: "center",
  },
  sendbutton: {
    color: "#F2F7F2",
    marginLeft: 15,
  },
  messageView: {
    padding: 15,
    paddingLeft: 5,
    // paddingLeft: 30,
    // backgroundColor: "#F2F7F2",
    alignItems: "flex-start",
    width: "100%",
    marginVertical: 0,
    position: "relative",
  },
  senderName: {
    // left: 10,
    // paddingRight: 10,
    // marginLeft: -5,
    fontSize: 10,
    color: "#727178",
    alignItems: "center",
    justifyContent: "center",
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingVertical: "10%",
    paddingHorizontal: "5%",
  },
  popupText: {
    color: "#F2F7F2",
    fontSize: 12,
    fontWeight: "bold",
  },
});
