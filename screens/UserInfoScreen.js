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
  // addDoc,
  // setDoc,
  doc,
  query,
  where,
  getDoc,
  // } from Platform.OS === "web" ? "../firebase" : "../firebaseMobile";
} from "../firebase";
import React, { useEffect, useState, useLayoutEffect } from "react";
import UIText from "../components/LocalizedText";
// import { SimpleLineIcons } from "@expo/vector-icons";
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
        alert("failed to fetch user"); // TODO translate
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
      // title: UIText.userInfoScreen.barTitle,
      title: UIText.userInfoScreen.barTitle.replace("USERNAME", user.name),
    });
  }, [navigation, user]);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={20} color="#f4f5f5" />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0a0a0b",
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
            window.open(
              `https://safe-image-view.vercel.app/?${user.pfp}`,
              "_blank"
            );
          } else {
            Linking.openURL(
              `https://safe-image-view.vercel.app/?${user.pfp}` ||
                "https://ingur.com/dA9mtkT.png"
            );
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
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "800",
          marginBottom: 10,
          textAlign: "center",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          color: "#f4f5f5",
        }}
      >
        {user.name}
        {route.params.uid === "POTATOCAT" ? (
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
                fontSize: 15,
              }}
            >
              SYSTEM
            </Text>
          </View>
        ) : null}
      </Text>
      {user.status ? (
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            marginBottom: 10,
            textAlign: "center",
            color: "#727178",
            fontStyle: "italic",
            paddingHorizontal: "20%",
          }}
        >
          {user.status}
        </Text>
      ) : null}
      {/* <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#f4f5f5",
          textAlign: "center",
        }}
      >
        user info screen wip
        {"\n"}is friend: {isFriend ? "yes" : "no"}
        {"\n"}
      </Text> */}
      <TouchableOpacity
        style={{
          backgroundColor: "#f4f5f5",
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
              // name: user.name,
            });
          } else {
            navigation.navigate("friends", {
              friendId: route.params.uid,
            });
          }
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#0a0a0b" }}>
          {/* {isFriend ? `go to chat` : "send friend request"} */}
          {isFriend ? UIText.userInfoScreen.gtc : UIText.userInfoScreen.sfr}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0b",
    alignItems: "center",
    justifyContent: "center",
  },
});
