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

const FriendsScreen = ({ navigation, route }) => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const db = getFirestore();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "friends",
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "white",
            headerTitleAlign: "center",
        });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "users", auth.currentUser.uid),
            (friends) => {
                var friendList = [];
                if (friends.data().friends.length > 0) {
                    for (var friend in friends.data().friends) {
                        getDoc(
                            doc(db, "users", friends.data().friends[friend])
                        ).then((userInfo) => {
                            friendList.push({
                                id: friends.data().friends[friend],
                                name: userInfo.data().name,
                                pfp: userInfo.data().pfp,
                            });
                            setFriends(friendList);
                            setLoading(false);
                        });
                    }
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
                            <Text style={{ fontSize: 20 }}>
                                no friends, sadly
                            </Text>
                        </Text>
                    </View>
                );
            }
        } else {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={friends}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    alert(`wowee you pressed ${item.name}`)
                                }
                                activeOpacity={0.8}
                            >
                                <View style={styles.friendContainer}>
                                    <Avatar
                                        rounded
                                        size={35}
                                        source={{
                                            uri: item.pfp
                                                ? item.pfp
                                                : "https://i.imgur.com/dA9mtkT.png",
                                        }}
                                        containerStyle={{ marginLeft: 10 }}
                                    />
                                    <Text style={styles.friendName}>
                                        {item.name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            alert(
                                                `you unfriended ${item.name} :(`
                                            );
                                            updateDoc(
                                                doc(
                                                    db,
                                                    "users",
                                                    auth.currentUser.uid
                                                ),
                                                {
                                                    friends: [
                                                        ...friends.filter(
                                                            (friend) =>
                                                                friend.id !==
                                                                item.id
                                                        ),
                                                    ],
                                                }
                                            );
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
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            );
        }
    }
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
