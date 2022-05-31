import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";
import {
  collection,
  addDoc,
  getFirestore,
  getAuth,
  doc,
  onSnapshot,
  // serverTimestamp,
  query,
  updateDoc,
  orderBy,
  getDoc,
  setDoc,
  where,
} from "../firebase";
import { Avatar } from "react-native-elements";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Popable } from "react-native-popable";

const FriendsScreen = ({ navigation, route }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uid, setUid] = useState("");

  const [friendId, setFriendId] = useState(route.params?.friendId || "");

  const auth = getAuth();
  const db = getFirestore();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "friend requests",
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
        console.log(error);
        setLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [route]);

  const addFriend = (id) => {
    if (id.includes("/") || id.includes(" ")) {
      setFriendId("");
      return;
    }
    // jeez look at this mess
    // you know what this reminds me of?
    // r a m e n
    // get it? noodles? hahhahahhahha
    // im a comedic genius
    if (id === auth.currentUser.uid) {
      alert(
        "you think you're clever huh? you think you outsmarted the system huh? well NO YOU HAVEN'T!!! THE MIGHTY POTAT CAN SEE THROUGH YOUR FUTILE TRICKS AND SHENANIGANS!!!!!"
      );
      setFriendId("");
      return;
    }
    getDoc(doc(db, "users", id)).then((friend) => {
      if (friend.exists() && !friends.includes(id)) {
        if (friend.data()?.friendRequests?.includes(auth.currentUser.uid)) {
          alert(`you alredy sent a friend request to ${friend.data().name}`);
          setFriendId("");
          return;
        }
        updateDoc(doc(db, "users", id), {
          friendRequests: [
            ...friend.data().friendRequests,
            auth.currentUser.uid,
          ],
        }).then(() => {
          alert(`sent request to ${friend.data().name}`);
          setFriendId("");
        });
      } else {
        setFriendId("");
        alert("user does not exist or is already a friend");
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
            <ActivityIndicator size={30} color="#0a0a0a" />
          ) : (
            <>
              <Popable
                content={
                  <View style={styles.popupContainer}>
                    <Text style={styles.popupText}>accept request</Text>
                  </View>
                }
                action="hover"
                style={{ opacity: 0.8 }}
                position="left"
              >
                <TouchableOpacity
                  onPress={() => confirmFriend(item.id, item.name)}
                >
                  <SimpleLineIcons name="check" size={30} color="#0a0a0a" />
                </TouchableOpacity>
              </Popable>
              <Popable
                content={
                  <View style={styles.popupContainer}>
                    <Text style={styles.popupText}>dismiss request</Text>
                  </View>
                }
                action="hover"
                style={{ opacity: 0.8 }}
                position="left"
              >
                <TouchableOpacity
                  onPress={() => rejectFriend(item.id)}
                  style={{
                    marginHorizontal: 10,
                  }}
                >
                  <SimpleLineIcons name="close" size={30} color="#0a0a0a" />
                </TouchableOpacity>
              </Popable>
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
        <ActivityIndicator size={20} color="#727178" />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#0a0a0a",
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
            fontSize: 15,
            padding: 10,
            borderWidth: 2,
            borderColor:
              friendId && !friendId.includes("/") ? "#F2F7F2" : "#727178",
            // marginRight: 10,
            color: "#F2F7F2",
            fontWeight: "700",
          }}
          placeholder="add friend by uid (found in the settings)"
          placeholderTextColor="#727178"
          value={friendId}
          onChangeText={(text) => {
            setFriendId(text);
          }}
          onSubmitEditing={() => {
            addFriend(friendId.trim());
          }}
        />
        {friendId && !friendId.includes("/") && (
          <TouchableOpacity
            onPress={() => {
              addFriend(friendId.trim());
            }}
            style={{
              marginLeft: 10,
              borderColor: "#F2F7F2",
              borderRadius: 5,
              borderWidth: 2,
              padding: 10,
              paddingHorizontal: 13,
            }}
          >
            <Text
              style={{
                color: "#F2F7F2",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              {"add"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
            }}
          >
            {"\\_(-_-)_/\n\n"}
            <Text style={{ fontSize: 15 }}>
              nobody wants to be friends with you :(
            </Text>
          </Text>
        }
      />
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F2F7F2",
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
    color: "#0a0a0a",
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
    padding: 10,
    flex: 1,
  },
  popupText: {
    color: "#F2F7F2",
    fontSize: 12,
    fontWeight: "bold",
  },
});
