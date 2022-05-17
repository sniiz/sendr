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
  where,
} from "../firebase";
import { Avatar } from "react-native-elements";
import { SimpleLineIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const FriendsTab = ({ navigation, route }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  // useLayoutEffect(() => {
  //     navigation.setOptions({
  //         title: "friends",
  //         headerStyle: { backgroundColor: "black" },
  //         headerTintColor: "white",
  //         headerTitleAlign: "center",
  //     });
  // }, [navigation]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (friends) => {
        var friendList = [];
        if (friends.data().friends.length > 0) {
          // for (var friend in friends.data().friends) {
          //   getDoc(doc(db, "users", friends.data().friends[friend])).then(
          //     (userInfo) => {
          //       friendList.push({
          //         id: friends.data().friends[friend],
          //         name: userInfo.data().name,
          //         pfp: userInfo.data().pfp,
          //       });
          //       setFriends(friendList);
          //       setLoading(false);
          //     }
          //   );
          // }
          friends.data().friends.forEach((element) => {
            getDoc(doc(db, "users", element)).then((userInfo) => {
              console.log(userInfo.data());
              friendList.push({
                id: element,
                name: userInfo.data().name,
                pfp: userInfo.data().pfp,
              });
              setFriends(friendList);
              setLoading(false);
            });
          });
        } else {
          setFriends([]);
          setLoading(false);
        }
        // setRequests(friends.data().friendRequests);
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

  const friendItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => alert(`wowee you pressed ${item.name}`)}
      activeOpacity={0.8}
    >
      <View style={styles.friendContainer}>
        <Avatar
          rounded
          size={35}
          source={{
            uri: item.pfp || "https://i.imgur.com/dA9mtkT.png",
          }}
          containerStyle={{ marginLeft: 10 }}
        />
        <Text style={styles.friendName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => {
            updateDoc(doc(db, "users", auth.currentUser.uid), {
              friends: [...friends.filter((friend) => friend.id !== item.id)],
            });
            updateDoc(doc(db, "users", item.id), {
              friends: [
                ...friends.filter(
                  (friend) => friend.id !== auth.currentUser.uid
                ),
              ],
            });
          }}
        >
          <SimpleLineIcons
            name="user-unfollow"
            size={20}
            color="gray"
            style={{
              marginLeft: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  } else {
    if (friends.length === 0) {
      // 0.1% chance of getting megamind'd
      if (Math.floor(Math.random() * 1000) === 420) {
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "black",
            }}
          >
            {/* <Image /> doesnt work here for some reason hmmmm */}
            <Avatar
              source={require("../assets/nofriends.jpg")}
              style={{ width: 300, height: 222 }}
              rounded={false}
            />
          </View>
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "black",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontFamily: "monospace",
                color: "gray",
                textAlign: "center",
              }}
            >
              {"( ･ᴗ･̥̥̥ )\n\n"}
              <Text style={{ fontSize: 20 }}>no friends.. so far</Text>
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={friends}
            renderItem={friendItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    }
  }
};

const RequestsTab = ({ navigation, route }) => {
  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: "center",
        },
      ]}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "gray",
          marginHorizontal: 20,
          textAlign: "center",
        }}
      >
        this tab is under construction. please go away for now
      </Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const FriendsScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "black",
        },
        tabBarIcon: () => {
          return null;
        },
        tabBarLabelStyle: {
          fontSize: 15,
          marginTop: -10,
        },
      }}
      tabBarOptions={{
        activeTintColor: "white",
        inactiveTintColor: "gray",
        backgroundColor: "black",
        style: {
          height: Platform.OS === "ios" ? 60 : 100,
        },
      }}
    >
      <Tab.Screen name="friends" component={FriendsTab} />
      <Tab.Screen name="requests" component={RequestsTab} />
    </Tab.Navigator>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
    padding: 5,
    paddingVertical: 15,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "gray",
  },
  friendName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "black",
  },
});
