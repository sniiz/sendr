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
  getFirestore,
  doc,
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
  const [noChats, setNoChats] = useState("");
  const [requests, setRequests] = useState([]);

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

  useEffect(() => {
    if (!auth?.currentUser?.uid) {
      navigation.replace("login");
      return;
    }
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace("login");
      } else if (!user?.emailVerified) {
        navigation.replace("verifyEmail");
      }
    });
    setNoChats(UIText.homeScreen[`lonely${Math.floor(Math.random() * 6) + 1}`]);
    const unsubscribe = onSnapshot(
      query(
        collection(db, "privateChats"),
        // orderBy("lastMessage", "desc"),
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
    const unsubscribeRequests = onSnapshot(
      doc(db, "users", getAuth().currentUser.uid),
      (snapshot) => {
        console.log(snapshot);
        setRequests(snapshot.data().friendRequests);
      }
    );
    return () => {
      unsubscribe();
      unsubscribeRequests();
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
          <Text
            style={{
              fontSize: 10,
              fontStyle: "italic",
              fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
              color: "#727178",
              marginLeft: 5,
            }}
          >
            v{version["number"]}
            {"  "}build {version.build}
          </Text>
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
              <Text
                style={{
                  fontSize: 18,
                  color: "#fa5f5f",
                  // marginTop: -5,
                  textShadowColor: "#fa5f5f",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 15,
                }}
              >
                <Icon.Users
                  width={18}
                  color={requests.length > 0 ? "#fa5f5f" : "#f4f5f5"}
                  strokeWidth={2}
                  style={{
                    marginBottom: -5,
                  }}
                />
                {requests?.length > 0 ? " !" : null}
              </Text>
            </TouchableOpacity>
          </Popable>
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
  }, [navigation, requests]);

  const enterChat = (id, chatName, author) => {
    // unsubscribe();
    navigation.navigate("chat", {
      id,
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
      <ScrollView style={styles.container}>
        {!Error && chats.length > 0 ? (
          chats.map(({ id, chatName, author }) => (
            <CustomListItem
              key={id}
              id={id}
              chatName={chatName}
              enterChat={enterChat}
              author={author}
            />
          ))
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
              {"\n"}
              {noChats}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("newChat")}
          style={{
            margin: 10,
            marginLeft: 17,
            width: 30,
          }}
        >
          {/* <Popable
            content={
              <View style={styles.popupContainer}>
                <Text style={styles.popupText}>
                  {UIText.newChatScreen.barTitle}
                </Text>
              </View>
            }
            action="hover"
            position="right"
            style={{
              opacity: 0.8,
            }}
          > */}
          {/* <SimpleLineIcons name="plus" size={30} color="#727178" /> */}
          <Icon.PlusCircle width={30} color="#727178" strokeWidth={2} />
          {/* </Popable> */}
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: "#0a0a0b",
  },
});
