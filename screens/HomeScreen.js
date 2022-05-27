import { SimpleLineIcons } from "@expo/vector-icons";
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  componentWillUnmount,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import CustomListItem from "../components/CustomListItem";
import {
  getAuth,
  signOut,
  collection,
  orderBy,
  query,
  onAuthStateChanged,
  where,
  updateDoc,
  doc,
  getDoc,
  getFirestore,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "../firebase";
// sorry firebase is gitignored im scared of .envs
import UIText from "../components/LocalizedText";
import { Popable } from "react-native-popable";

const version = require("../assets/version-info.json");

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [textBoxOpen, setTextBoxOpen] = useState(false);
  const [chatId, setChatId] = useState("");

  const joinMessages = [
    "joined!",
    "is here!",
    "appeared out of thin air!",
    "has arrived!",
    "entered!",
    "came in!",
    "has joined!",
    "joined us here on this fine day!",
    "stopped by!",
    "came by!",
  ];

  const auth = getAuth();
  const db = getFirestore();

  // const signOutUser = () => {
  //     signOut(auth).then(() =>
  //         navigation.replace(UIText["loginScreen"]["barTitle"])
  //     );
  // };

  useEffect(() => {
    if (!auth?.currentUser?.uid) {
      navigation.replace("login");
      return;
    }
    const unsubscribe = onSnapshot(
      query(
        collection(db, "privateChats"),
        orderBy("chatName", "desc"),
        where("members", "array-contains", getAuth().currentUser.uid)
      ),
      (snapshot) => {
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.chatName,
            author: doc.author,
            ...doc.data(),
          }))
        );
        if (loading) {
          setLoading(false);
        }
      },
      (error) => {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    );
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace("login");
      } else if (!user?.emailVerified) {
        navigation.replace("verifyEmail");
      }
    });
    return () => {
      unsubscribe();
      unsubAuth();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "sendr",
      headerStyle: { backgroundColor: "black" },
      headerTintColor: "white",
      headerTitleAlign: "center",
      headerLeft: () => (
        <Popable
          content={
            <View style={styles.popupContainer}>
              <Text style={styles.popupText}>
                {UIText["homeScreen"]["github"]}
              </Text>
            </View>
          }
          action="hover"
          style={{ opacity: 0.8 }}
          position="bottom"
        >
          <TouchableOpacity
            style={{
              marginLeft: 20,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => {
              if (Platform.OS === "web") {
                window.open("https://github.com/sniiz/sendr", "_blank");
              } else {
                Linking.openURL("https://github.com/sniiz/sendr");
              }
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontStyle: "italic",
                fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
                color: "gray",
                marginLeft: 5,
              }}
            >
              <SimpleLineIcons
                name="social-github"
                size={10}
                color="gray"
                style={{ marginLeft: 10 }}
              />{" "}
              {version["number"]}{" "}
              <SimpleLineIcons name="share-alt" size={10} color="gray" />
            </Text>
          </TouchableOpacity>
        </Popable>
      ),
      headerRight: () => (
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
                  {UIText["homeScreen"]["friends"]}
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
                navigation.navigate("friends");
              }}
            >
              <SimpleLineIcons name="people" size={18} color="white" />
            </TouchableOpacity>
          </Popable>

          {/* <Popable
            content={
              <View style={styles.popupContainer}>
                <Text style={styles.popupText}>
                  {UIText["homeScreen"]["newChat"]}
                </Text>
              </View>
            }
            action="hover"
            style={{ opacity: 0.8 }}
            position="bottom"
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("newChat")}
            >
              <SimpleLineIcons name="speech" size={18} color="white" />
            </TouchableOpacity>
          </Popable> */}

          <Popable
            content={
              <View style={styles.popupContainer}>
                <Text style={styles.popupText}>
                  {UIText["homeScreen"]["settings"]}
                </Text>
              </View>
            }
            action="hover"
            style={{ opacity: 0.8 }}
            position="bottom"
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("settings")}
            >
              <SimpleLineIcons name="settings" size={18} color="white" />
            </TouchableOpacity>
          </Popable>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName, author) => {
    // unsubscribe();
    navigation.navigate("chat", {
      id,
      chatName,
      author,
    });
  };

  const joinChat = (id) => {
    setChatId("");
    if (id.includes("/")) {
      setChatId("");
      alert("chat id cannot contain slashes");
      return;
    }
    getDoc(doc(db, "privateChats", id)).then((chatDoc) => {
      console.log(chatDoc);
      if (chatDoc.exists()) {
        const chat = chatDoc.data();
        if (chat.members.includes(getAuth().currentUser.uid)) {
          enterChat(id, chat.chatName, chat.author);
        } else {
          updateDoc(doc(db, "privateChats", id), {
            members: [...chat.members, getAuth().currentUser.uid],
          }).then(() => {
            addDoc(collection(db, `privateChats/${id}`, "messages"), {
              timestamp: serverTimestamp(),
              message: `${getAuth().currentUser.displayName} ${
                joinMessages[Math.floor(Math.random() * joinMessages.length)]
              }`,
              displayName: "potat",
              uid: "POTATOCAT",
              photoURL: "https://i.imgur.com/UFr7hCb.png",
            });
            enterChat(id, chat.chatName, chat.author);
          });
        }
      } else {
        alert(`no chat with id "${id}" found`);
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.main,
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator size={20} color="gray" />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.main}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "gray",
          }}
        >
          <TextInput
            style={{
              width: "100%",
              fontSize: 15,
              padding: 10,
              borderWidth: 1,
              borderColor: chatId ? "white" : "gray",
              // marginRight: 10,
              color: "white",
            }}
            placeholder="join chat by id"
            placeholderTextColor="gray"
            value={chatId}
            onChangeText={(text) => {
              setChatId(text);
            }}
            onSubmitEditing={() => {
              joinChat(chatId.trim());
            }}
          />
          {chatId && (
            <TouchableOpacity
              onPress={() => {
                joinChat(chatId.trim());
              }}
              style={{
                marginLeft: 10,
                borderColor: "white",
                borderRadius: 5,
                borderWidth: 1,
                padding: 10,
                paddingHorizontal: 13,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                }}
              >
                {"join"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {!Error && chats.length > 0 ? (
          <ScrollView style={styles.container}>
            {chats.map(({ id, chatName, author }) => (
              <CustomListItem
                key={id}
                id={id}
                chatName={chatName}
                enterChat={enterChat}
                author={author}
              />
            ))}
            <TouchableOpacity
              onPress={() => navigation.navigate("newChat")}
              style={{
                margin: 10,
                marginLeft: 17,
              }}
            >
              <SimpleLineIcons name="plus" size={30} color="gray" />
            </TouchableOpacity>
          </ScrollView>
        ) : Error ? (
          <View style={styles.containerStatic}>
            <Text
              style={{
                fontSize: 40,
                color: "gray",
                textAlign: "center",
              }}
            >
              {"(・_・ヾ"}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
                textAlign: "center",
                fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                fontStyle: "italic",
              }}
            >
              {UIText["errors"]["noChats"]}
            </Text>
          </View>
        ) : (
          <View style={styles.containerStatic}>
            <Text
              style={{
                fontSize: 40,
                color: "gray",
                textAlign: "center",
              }}
            >
              {"_(-ω-`_)"}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
                textAlign: "center",
                fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                fontStyle: "italic",
              }}
            >
              {
                UIText["homeScreen"][
                  `lonely${Math.floor(Math.random() * 6) + 1}`
                ]
              }
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "black",
  },
  containerStatic: {
    flex: 1,
    color: "black",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: "15%",
    paddingHorizontal: "10%",
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    paddingVertical: "10%",
  },
  popupText: {
    color: "white",
    fontSize: 12,
  },
  main: {
    flex: 1,
    color: "black",
    backgroundColor: "black",
  },
});
