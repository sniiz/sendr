// import { SimpleLineIcons } from "@expo/vector-icons";
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  // componentWillUnmount,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  // Alert,
  TouchableOpacity,
  // Linking,
  Platform,
} from "react-native";
import CustomListItem from "../components/CustomListItem";
import {
  getAuth,
  // signOut,
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
  // } from Platform.OS === "web" ? "../firebase" : "../firebaseMobile";
} from "../firebase";
import UIText from "../components/LocalizedText";
import { Popable } from "react-native-popable";
import ActivityIndicator from "../components/ActivityIndicator";
import * as Icon from "react-native-feather";

const version = require("../assets/version-info.json");

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [textBoxOpen, setTextBoxOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [noChats, setNoChats] = useState("");

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
  //         navigation.replace(UIText.loginScreen.barTitle)
  //     );
  // };

  useEffect(() => {
    if (!auth?.currentUser?.uid) {
      navigation.replace("login");
      return;
    }
    setNoChats(UIText.homeScreen[`lonely${Math.floor(Math.random() * 6) + 1}`]);
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
        // console.log(error);
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
      headerTintColor: "#f4f5f5",
      headerTitleAlign: "center",
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            // alignItems: "center",
            justifyContent: "center",
            // alignSelf: "center",
            marginLeft: 10,
            // marginRight: 20,
          }}
        >
          {/* <Popable
            content={
              <View style={styles.popupContainer}>
                <Text style={styles.popupText}>
                  {UIText.homeScreen.github}
                </Text>
              </View>
            }
            action="hover"
            style={{ opacity: 0.8 }}
            position="bottom"
          > */}
          {/* <TouchableOpacity
              style={{
                // marginLeft: 20,
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
            > */}
          <Text
            style={{
              fontSize: 10,
              fontStyle: "italic",
              fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
              color: "#727178",
              marginLeft: 5,
            }}
          >
            {/* <Icon.Github width={20} color="#727178" strokeWidth={2} /> */}
            {version["number"]}{" "}
            {/* <SimpleLineIcons name="share-alt" size={10} color="#727178" /> */}
          </Text>
          {/* </TouchableOpacity> */}
          {/* </Popable> */}
        </View>
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
                  {UIText.homeScreen.friends}
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
              {/* <SimpleLineIcons name="people" size={18} color="#f4f5f5" /> */}
              <Icon.Users width={18} color="#f4f5f5" strokeWidth={2} />
            </TouchableOpacity>
          </Popable>

          {/* <Popable
            content={
              <View style={styles.popupContainer}>
                <Text style={styles.popupText}>
                  {UIText.homeScreen.newChat}
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
              <SimpleLineIcons name="speech" size={18} color="#f4f5f5" />
            </TouchableOpacity>
          </Popable> */}

          <Popable
            content={
              <View style={styles.popupContainer}>
                <Text style={styles.popupText}>
                  {UIText.homeScreen.settings}
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
              {/* <SimpleLineIcons name="settings" size={18} color="#f4f5f5" /> */}
              <Icon.Settings width={18} color="#f4f5f5" strokeWidth={2} />
            </TouchableOpacity>
          </Popable>
        </View>
      ),
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: "900", color: "#f4f5f5" }}>
          {/* <Text style={{ color: "#ff595e" }}>s</Text>
          <Text style={{ color: "#ffca3a" }}>e</Text>
          <Text style={{ color: "#8ac926" }}>n</Text>
          <Text style={{ color: "#1982c4" }}>d</Text>
          <Text style={{ color: "#9273bd" }}>r</Text> */}
          sendr
        </Text>
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
    if (id.includes("/") || id.includes(" ")) {
      setChatId("");
      alert(UIText.homeScreen.invalid);
      return;
    }
    getDoc(doc(db, "privateChats", id)).then((chatDoc) => {
      // console.log(chatDoc);
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
        alert(UIText.homeScreen.noChatFound);
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
        <ActivityIndicator size={20} color="#f4f5f5" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.main}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 2,
          borderBottomColor: "#727178",
        }}
      >
        <TextInput
          style={{
            width: "100%",
            maxWidth: "100%",
            flex: 1,
            fontSize: 15,
            padding: 10,
            borderWidth: 2,
            borderColor: chatId ? "#f4f5f5" : "#727178",
            fontWeight: "700",
            color: "#f4f5f5",
            // outlineStyle: "none", // doesn't work on ios for some reason - bummer
          }}
          placeholder={UIText.homeScreen.joinChat}
          placeholderTextColor="#727178"
          value={chatId}
          onChangeText={(text) => {
            setChatId(text);
          }}
          onSubmitEditing={() => {
            joinChat(chatId.trim());
          }}
        />
        {chatId ? (
          <TouchableOpacity
            onPress={() => {
              joinChat(chatId.trim());
            }}
            style={{
              marginLeft: 10,
              borderColor: "#f4f5f5",
              backgroundColor: "#f4f5f5",
              borderRadius: 5,
              borderWidth: 2,
              padding: 10,
              paddingHorizontal: 13,
            }}
          >
            <Text
              style={{
                color: "#0a0a0b",
                fontSize: 15,
                fontWeight: "800",
              }}
            >
              {UIText.homeScreen.join}
            </Text>
          </TouchableOpacity>
        ) : null}
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
            {/* <SimpleLineIcons name="plus" size={30} color="#727178" /> */}
            <Icon.PlusCircle width={30} color="#727178" strokeWidth={2} />
          </TouchableOpacity>
        </ScrollView>
      ) : Error ? (
        <View style={styles.containerStatic}>
          <Text
            style={{
              fontSize: 40,
              color: "#727178",
              textAlign: "center",
            }}
          >
            {"(」°ロ°)」"}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#727178",
              textAlign: "center",
              fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
              fontStyle: "italic",
            }}
          >
            {UIText.errors.noChats}
          </Text>
        </View>
      ) : (
        <View style={styles.containerStatic}>
          <Text
            style={{
              fontSize: 40,
              color: "#727178",
              textAlign: "center",
            }}
          >
            {"(っ´ω`)ﾉ(╥ω╥)"}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#727178",
              textAlign: "center",
              fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
              fontStyle: "italic",
            }}
          >
            {noChats}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#0a0a0b",
  },
  containerStatic: {
    flex: 1,
    color: "#0a0a0b",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: "15%",
    paddingHorizontal: "10%",
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0b",
    paddingVertical: "10%",
  },
  popupText: {
    color: "#f4f5f5",
    fontSize: 12,
    fontWeight: "bold",
  },
  main: {
    flex: 1,
    color: "#0a0a0b",
    backgroundColor: "#0a0a0b",
  },
});
