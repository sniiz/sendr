import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import {
  getAuth,
  getFirestore,
  getDocs,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDoc,
} from "../firebase";
import React, { useEffect, useState, useLayoutEffect } from "react";
import UIText from "../components/LocalizedText";
import { SimpleLineIcons } from "@expo/vector-icons";
import ActivityIndicator from "../components/ActivityIndicator";

const UserInfoScreen = ({ navigation, route }) => {
  const [user, setUser] = useState({});
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dmID, setDmID] = useState("");
  useEffect(() => {
    getDoc(doc(getFirestore(), "users", route.params.uid))
      .then((userdoc) => {
        setUser(userdoc.data());
      })
      .catch((err) => {
        // console.log(err);
        alert("user does not exist");
        navigation.replace("home");
      });
    getDoc(doc(getFirestore(), "users", getAuth().currentUser.uid)).then(
      (user) => {
        const friends = user.data().friends;
        setIsFriend(friends.includes(route.params.uid));
        if (friends.includes(route.params.uid)) {
          getDocs(
            query(
              collection(getFirestore(), "privateChats"),
              where("members", "array-contains", getAuth().currentUser.uid),
              where("dm", "==", true)
            )
          ).then((chats) => {
            chats.forEach((chat) => {
              if (chat.data().members.includes(route.params.uid)) {
                setDmID(chat.id);
                setLoading(false);
              }
              // messy but works
              // the motto of this entire app haha
            });
          });
        } else {
          setLoading(false);
        }
      }
    );
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      // title: UIText["userInfoScreen"]["barTitle"],
      title: `${user?.name}'${user?.name?.endsWith("s") ? "" : "s"} profile`,
    });
  }, [navigation, user]);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={20} color="#F2F7F2" />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0a0a0a",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          marginTop: -100,
          marginBottom: 10,
        }}
        onPress={() => {
          if (Platform.OS === "web") {
            window.open(user.pfp, "_blank");
          } else {
            Linking.openURL(user.pfp || "https://ingur.com/dA9mtkT.png");
          }
        }}
      >
        <Image
          source={{
            uri: user.pfp || "https://imgur.com/dA9mtkT.png",
          }}
          style={{
            width: 300,
            height: 300,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: "#F2F7F2",
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "800",
          marginBottom: 10,
          textAlign: "center",
          color: "#F2F7F2",
        }}
      >
        {user.name}
      </Text>
      {/* <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#F2F7F2",
          textAlign: "center",
        }}
      >
        user info screen wip
        {"\n"}is friend: {isFriend ? "yes" : "no"}
        {"\n"}
      </Text> */}
      <TouchableOpacity
        style={{
          backgroundColor: "#F2F7F2",
          padding: 10,
          paddingHorizontal: 15,
          borderRadius: 10,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          if (isFriend) {
            navigation.navigate("chat", {
              id: dmID,
              name: user.name,
            });
          } else {
            navigation.navigate("friends", {
              friendId: route.params.uid,
            });
          }
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#0a0a0a" }}>
          {isFriend ? `go to chat` : "send friend request"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserInfoScreen;
