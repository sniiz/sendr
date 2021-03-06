// import { SimpleLineIcons } from "@expo/vector-icons";
import * as Icon from "react-native-feather";
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
  ScrollView,
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
  getDoc,
  query,
  serverTimestamp,
  doc,
  deleteDoc,
  uploadBytes,
  getDownloadURL, // 👀
} from "../firebase";
import ActivityIndicator from "../components/ActivityIndicator";
import { Popable } from "react-native-popable";
import { setString } from "expo-clipboard";
import Theme from "../components/themes";

const ChatScreen = ({ navigation, route }) => {
  const [msgInput, setMsgInput] = useState("");
  const [author, setAuthor] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [chatName, setChatName] = useState("");

  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [devs, setDevs] = useState([]);

  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dm, setDm] = useState(false);
  const [msgBlocked, setMsgBlocked] = useState(false);

  const flatListRef = useRef(null);

  const [badWords, setBadWords] = useState([]);

  const [theme, setTheme] = useState(null);

  const leaveMessages = [
    "left :(",
    "left",
    "left the chat",
    "went away :(",
    "left. they will be missed :(",
    "left us :(",
  ];

  const j = "TVeHDZSeiGNVN2gYmvkDDv2uCaN2";

  const auth = getAuth();
  const db = getFirestore();

  useEffect(async () => {
    // TODO get rid of callback hell
    const unsubscribe = onSnapshot(
      query(
        collection(db, `privateChats/${route.params.id}`, "messages"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        const docs = snapshot.docs;
        let messagesList = [];
        docs.forEach((message) => {
          messagesList.push({
            id: message.id,
            ...message.data(),
          });
        });
        setMessages(messagesList);
      }
    );
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace("login");
      } else if (!user?.emailVerified) {
        navigation.replace("verifyEmail");
      } else {
        unsubAuth();
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
                ? UIText.chatScreen.you
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
    });
    setBadWords(
      (await getDoc(doc(db, "otherStuff", "badWords"))).data().badWords
    );
    return () => {
      unsubscribe();
      unsubAuth();
    };
  }, [route]);

  useLayoutEffect(() => {
    setTheme(Theme.get("classic"));

    navigation.setOptions({
      title:
        route.params?.chatName !== null ? route.params.chatName : otherUser,
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
                    {UIText.chatScreen.copyChatId}
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
                  setString(
                    encodeURI(
                      `https://sendr-sniiz.vercel.app/invite.html?inviter=${auth.currentUser.displayName}&chatId=${route.params.id}&chatName=${chatName}`
                    )
                  );
                }}
              >
                {/* <SimpleLineIcons name="docs" size={18} color="#f4f5f5" /> */}
                <Icon.Copy
                  stroke={theme?.accent}
                  strokeWidth={2}
                  width={18}
                  height={18}
                />
              </TouchableOpacity>
            </Popable>
            <Popable
              content={
                <View style={styles.popupContainer}>
                  <Text style={styles.popupText}>{UIText.chatScreen.exit}</Text>
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
                      attachments: [],
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
                {/* <SimpleLineIcons name="logout" size={18} color="#f4f5f5" /> */}
                <Icon.LogOut
                  stroke={theme?.accent}
                  strokeWidth={2}
                  width={18}
                  height={18}
                />
              </TouchableOpacity>
            </Popable>
          </View>
        );
      },
    });
  }, [navigation, dm, otherUser, loaded]);

  const sendMessage = async () => {
    Keyboard.dismiss();
    setSending(true);

    if (msgInput.trim().length > 0 && msgInput.trim().length <= 1000) {
      let messageText = msgInput.trim();
      if (!msgBlocked) {
        for (let word of badWords) {
          if (messageText.toLowerCase().includes(word)) {
            alert(UIText.chatScreen.badWord);
            setMsgBlocked(true);
            setSending(false);
            return;
          }
        }
      }

      setMsgBlocked(false);

      let links =
        msgInput.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
        ) || [];
      let images = [];

      // get the images only
      if (links.length) {
        links = links.filter(
          (link) =>
            link.endsWith(".png") ||
            link.endsWith(".jpg") ||
            link.endsWith(".gif")
        );
        // 5 images per message max
        if (links.length >= 5) {
          links = links.slice(0, 5);
        }
        messageText = messageText.replace(
          new RegExp(links.join("|"), "gi"),
          "(image attachment)"
        );
        for (let image of links) {
          Image.getSize(image, (w, h) => {
            images.push({
              url: image,
              width: w,
              height: h,
            });
          });
        }
      }
      setMsgInput("");
      const message = {
        // its late im literally in bed, tired, and desperate
        timestamp: serverTimestamp(),
        message: messageText,
        attachments: images,
        displayName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        photoURL:
          auth.currentUser.photoURL || "https://i.imgur.com/dA9mtkT.png",
      };
      await addDoc(
        collection(db, `privateChats/${route.params.id}`, "messages"),
        message
      ).catch((error) => alert(error));
      setSending(false);
    } else {
      setSending(false);
    }
  };

  const handlePfpClick = (item) => {
    if (item.uid === auth.currentUser.uid) {
      navigation.navigate("settings");
    } else {
      navigation.navigate("userInfo", {
        uid: item.uid,
      });
    }
  };

  const messageItem = ({ item }) => {
    const isUser =
      item.uid === auth?.currentUser?.uid ||
      item.email === auth?.currentUser?.email;
    const main = isUser ? theme.accent : theme.main;
    const second = isUser ? theme.main : theme.accent;
    const third = isUser ? theme.separator1 : theme.separator2;
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
        <TouchableOpacity
          onPress={() => {
            handlePfpClick(item);
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
              marginLeft: 10,
            }}
          />
        </TouchableOpacity>
        <View style={[styles.messageView, { backgroundColor: main }]}>
          <Text
            style={[
              styles.senderName,
              {
                color: theme.middle,
              },
            ]}
          >
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
                    color: "#f4f5f5",
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
                    color: "#f4f5f5",
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
                    color: "#0a0a0b",
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
          {item.attachments ? (
            <ScrollView
              horizontal
              style={{
                maxWidth: "90%",
              }}
            >
              {item.attachments.map((image) => (
                <TouchableOpacity
                  style={{
                    margin: 5,
                  }}
                  key={image.url}
                  onPress={() => {
                    if (Platform.OS === "web") {
                      window.open(
                        `https://safe-image-view.vercel.app/?${image.url}`,
                        "_blank"
                      );
                    } else {
                      Linking.openURL(
                        `https://safe-image-view.vercel.app/?${image.url}`
                      );
                    }
                  }}
                >
                  <Image
                    source={{ uri: image.url }}
                    style={{
                      width: image.width / 2,
                      height: image.height / 2,
                      maxHeight: 400,
                      maxWidth: 400,
                      aspectRatio: image.width / image.height,
                      // marginLeft: 10,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
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
        color: theme?.middle,
        textAlign: "center",
        marginVertical: 10,
      }}
    >
      {dm
        ? `${otherUser}${UIText.chatScreen.friends}`
        : `${author}${UIText.chatScreen.created}${chatName}`}
    </Text>
  );

  const scrollToBottom = () => {
    // flatListRef.current.scrollToOffset({
    //   animated: true,
    //   offset: 0,
    // });
    flatListRef.current.scrollToEnd({ animated: true });
  };

  if (!loaded) {
    return (
      <View
        style={{
          backgroundColor: theme?.main,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={20} color={theme?.accent} />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme?.main,
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
                ListHeaderComponent={createdHeader}
                onContentSizeChange={scrollToBottom}
                windowSize={41}
                renderItem={messageItem}
              />
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: theme?.main,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    // fontWeight: "bold",
                    color: theme?.middle,
                    textAlign: "center",
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                    }}
                  >
                    {"ヽ(・∀・)ﾉ\n\n"}
                  </Text>
                  {UIText.chatScreen.saysth}
                </Text>
              </View>
            )}
            <View style={styles.footer}>
              <TextInput
                placeholder={UIText.chatScreen.inputPlaceholder}
                textContentType="none"
                placeholderTextColor={theme?.middle}
                style={[
                  styles.textInput,
                  {
                    color: theme?.accent,
                    borderColor: theme?.accent,
                  },
                ]}
                value={msgInput}
                onChangeText={(text) => {
                  setMsgInput(text);
                  setMsgBlocked(false);
                }}
                onSubmitEditing={sendMessage}
                autoCorrect={false}
              />
              {sending ? (
                <Popable
                  content={
                    <View style={styles.popupContainer}>
                      <Text style={styles.popupText}>
                        {UIText.chatScreen.sending}
                      </Text>
                    </View>
                  }
                  action="hover"
                  style={{ opacity: 0.8 }}
                  position="top"
                >
                  <ActivityIndicator
                    size="small"
                    color={theme?.accent}
                    style={{ marginLeft: 15 }}
                  />
                </Popable>
              ) : msgInput !== "" && msgInput.length <= 1000 ? (
                <Popable
                  content={
                    <View style={styles.popupContainer}>
                      <Text style={styles.popupText}>
                        {UIText.chatScreen.send}
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
                    onPress={sendMessage}
                  >
                    {/* <SimpleLineIcons
                      name="paper-plane"
                      size={20}
                      color="#f4f5f5"
                    /> */}
                    <Icon.Send stroke={theme?.accent} width={20} />
                  </TouchableOpacity>
                </Popable>
              ) : (
                <Popable
                  content={
                    <View style={styles.popupContainer}>
                      <Text style={styles.popupText}>
                        {msgInput.length > 1000 && UIText.chatScreen.tooLong}
                      </Text>
                    </View>
                  }
                  action="hover"
                  style={{ opacity: 0.8 }}
                  position="top"
                >
                  {/* <SimpleLineIcons
                    name="paper-plane"
                    size={20}
                    color="#445"
                    style={{ marginLeft: 15 }}
                  /> */}
                  <Icon.Send
                    stroke={theme?.middle}
                    width={20}
                    style={{
                      marginLeft: 15,
                    }}
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
    marginBottom: 10,
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
    color: "#f4f5f5",
    borderWidth: 2,
    // outlineStyle: "none", // doesn't work on ios for some reason - bummer
    borderColor: "#f4f5f5",
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
    color: "#f4f5f5",
    marginLeft: 15,
  },
  messageView: {
    padding: 15,
    paddingLeft: 5,
    // paddingLeft: 30,
    // backgroundColor: "#f4f5f5",
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
    backgroundColor: "#0a0a0b",
    paddingVertical: "10%",
    paddingHorizontal: "5%",
  },
  popupText: {
    color: "#f4f5f5",
    fontSize: 12,
    fontWeight: "bold",
  },
});
