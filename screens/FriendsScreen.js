import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  // KeyboardAvoidingView,
  // Platform,
  View,
  // TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Text,
} from "react-native";
import {
  // collection,
  // addDoc,
  getFirestore,
  getAuth,
  doc,
  onSnapshot,
  // serverTimestamp,
  // query,
  updateDoc,
  // orderBy,
  getDoc,
  setDoc,
  // where,
  // } from Platform.OS === "web" ? "../firebase" : "../firebaseMobile";
} from "../firebase";
import { Avatar } from "react-native-elements";
import { SimpleLineIcons } from "@expo/vector-icons";
// import { Popable } from "react-native-popable";
import UIText from "../components/LocalizedText";
import ActivityIndicator from "../components/ActivityIndicator";

const FriendsScreen = ({ navigation, route }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [friendId, setFriendId] = useState(route.params?.friendId || "");

  const [megamind, setMegamind] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: UIText.friendsScreen.barTitle,
    });
  }, [navigation]);

  useEffect(() => {
    if (!auth?.currentUser?.uid) {
      navigation.replace("login");
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (user) => {
        var requestsList = [];
        user.data().friendRequests.forEach((request) => {
          getDoc(doc(db, "users", request)).then((maybeFriend) => {
            if (maybeFriend.exists()) {
              requestsList.push({ ...maybeFriend.data(), id: maybeFriend.id });
              setRequests(requestsList);
            } else {
              // user no longer exists, remove their request
              updateDoc(doc(db, "users", auth.currentUser.uid), {
                friendRequests: user
                  .data()
                  .friendRequests.filter((req) => req !== request),
              });
            }
          });
        });
        setFriends(user.data().friends);
        setLoading(false);
      },
      (error) => {
        // console.log(error);
        setLoading(false);
      }
    );
    const funnyNumber = Math.round(Math.random() * 50);
    console.log(funnyNumber);
    setMegamind(funnyNumber === 28);
    return () => {
      unsubscribe();
    };
  }, [route]);

  const addFriend = (id) => {
    if (id.includes("/") || id.includes(" ")) {
      setFriendId("");
      return;
    }
    if (id.trim() === "POTATOCAT") {
      alert("no. sadly you cannot befriend the potatocat."); // TODO translate
      setFriendId("");
      return;
    }
    // jeez look at this mess
    // you know what this reminds me of?
    // r a m e n
    // get it? noodles? hahhahahhahha
    // im a comedic genius
    if (id === auth.currentUser.uid) {
      alert(UIText.friendsScreen.evilRant);
      setFriendId("");
      return;
    }
    getDoc(doc(db, "users", id)).then((friend) => {
      if (friend.exists() && !friends.includes(id)) {
        if (friend.data()?.friendRequests?.includes(auth.currentUser.uid)) {
          alert(UIText.friendsScreen.sentAlready);
          setFriendId("");
          return;
        }
        updateDoc(doc(db, "users", id), {
          friendRequests: [
            ...friend.data().friendRequests,
            auth.currentUser.uid,
          ],
        }).then(() => {
          alert(`${UIText.friendsScreen.sent} ${friend.data().name}`);
          setFriendId("");
        });
      } else {
        setFriendId("");
        alert(UIText.friendsScreen.doesntExist);
      }
    });
  };

  const confirmFriend = (id, name) => {
    getDoc(doc(db, "users", id)).then((friend) => {
      updateDoc(doc(db, "users", id), {
        friends: [...friend.data().friends, auth.currentUser.uid],
      });
    });
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      friends: [...friends, id],
      friendRequests: requests.filter((item) => item.id !== id),
    }).then(() => {
      setDoc(doc(db, "privateChats", auth.currentUser.uid + id), {
        chatName: null,
        members: [auth.currentUser.uid, id],
        author: null,
        dm: true,
      }).then((chat) => {
        navigation.navigate("home");
      });
    });
  };

  const rejectFriend = (id) => {
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      friendRequests: requests.filter((item) => item.id !== id),
    });
  };

  const friendRequestItem = ({ item }) => {
    return (
      <View style={styles.friendContainer}>
        <Avatar
          rounded
          size={40}
          source={{
            uri: item.pfp || "https://i.imgur.com/dA9mtkT.png",
          }}
          containerStyle={{ margin: 5 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            marginLeft: 10,
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            flex: 1,
            alignContent: "flex-end",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          {loading ? (
            <ActivityIndicator size={30} color="#f4f5f5" />
          ) : (
            <>
              {/* <Popable
                content={
                  <View style={styles.popupContainer}>
                    <Text style={styles.popupText}>accept request</Text>
                  </View>
                }
                action="hover"
                style={{ opacity: 0.8 }}
                position="left"
              > */}
              <TouchableOpacity
                onPress={() => confirmFriend(item.id, item.name)}
              >
                <SimpleLineIcons name="check" size={30} color="#0a0a0b" />
              </TouchableOpacity>
              {/* </Popable>
              <Popable
                content={
                  <View style={styles.popupContainer}>
                    <Text style={styles.popupText}>dismiss request</Text>
                  </View>
                }
                action="hover"
                style={{ opacity: 0.8 }}
                position="left"
              > */}
              <TouchableOpacity
                onPress={() => rejectFriend(item.id)}
                style={{
                  marginHorizontal: 10,
                }}
              >
                <SimpleLineIcons name="close" size={30} color="#0a0a0b" />
              </TouchableOpacity>
              {/* </Popable> */}
            </>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            alignContent: "center",
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator
          size={20}
          color="#f4f5f5"
          style={{
            alignSelf: "center",
          }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#0a0a0b",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: friends.length > 0 ? "flex-start" : "center",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 2,
          borderBottomColor: "#727178",
        }}
      >
        <TextInput
          style={{
            width: "100%",
            flex: 1,
            fontSize: 15,
            padding: 10,
            borderWidth: 2,
            borderColor:
              friendId && !friendId.includes("/") ? "#f4f5f5" : "#727178",
            // marginRight: 10,
            // outlineStyle: "none", // doesn't work on ios for some reason - bummer
            color: "#f4f5f5",
            fontWeight: "700",
          }}
          placeholder={UIText.friendsScreen.idInput}
          placeholderTextColor="#727178"
          value={friendId}
          onChangeText={(text) => {
            setFriendId(text);
          }}
          onSubmitEditing={() => {
            addFriend(friendId.trim());
          }}
        />
        {friendId ? (
          <TouchableOpacity
            onPress={() => {
              addFriend(friendId.trim());
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
              {UIText.friendsScreen.add}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {requests.length === 0 && megamind ? (
        <View
          style={[
            styles.container,
            {
              alignContent: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Image
            source={require("../assets/nofriends.jpg")}
            style={{
              width: "30%",
              aspectRatio: 300 / 222,
              alignSelf: "center",
            }}
          />
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={friendRequestItem}
          keyExtractor={(item) => item.id}
          style={{
            flex: 1,
          }}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 30,
                fontFamily: "monospace",
                color: "#727178",
                textAlign: "center",
                alignSelf: "center",
                marginTop: "10%",
              }}
            >
              {":'(\n\n"}
              <Text style={{ fontSize: 15 }}>
                {UIText.friendsScreen.noFriends}
              </Text>
            </Text>
          }
        />
      )}
    </View>
  );
};

export default React.memo(FriendsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0b",
  },
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#f4f5f5",
    padding: 5,
    // paddingVertical: 15,
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "#727178",
  },
  friendName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#0a0a0b",
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0b",
    padding: 10,
    flex: 1,
  },
  popupText: {
    color: "#f4f5f5",
    fontSize: 12,
    fontWeight: "bold",
  },
});
