import { StatusBar } from "expo-status-bar";
import { SimpleLineIcons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Avatar } from "react-native-elements";
import CustomListItem from "../components/CustomListItem";
import {
    getAuth,
    signOut,
    collection,
    getFirestore,
    onSnapshot,
} from "../firebase";
// sorry firebase is gitignored im scared of .envs
import UIText from "../components/LocalizedText";

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [Error, setError] = useState(false);
    const auth = getAuth();
    const db = getFirestore();

    const signOutUser = () => {
        signOut(auth).then(() =>
            navigation.replace(UIText["loginScreen"]["barTitle"])
        );
    };

    useEffect(
        () =>
            onSnapshot(
                collection(db, "chats"),
                (snapshot) => {
                    setChats(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            name: doc.chatName,
                            ...doc.data(),
                        }))
                    );
                },
                // wow this code below looks awful
                // but it works
                (error) => {
                    setError(true);
                }
            ),
        []
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "sendr",
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Avatar
                            rounded
                            source={{ uri: auth?.currentUser?.photoURL }}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View
                    style={{
                        marginRight: 20,
                        width: 120,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        backgroundColor: "white",
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                            navigation.navigate(
                                UIText["newChatScreen"]["barTitle"]
                            )
                        }
                    >
                        <SimpleLineIcons
                            name="speech"
                            size={18}
                            color="black"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                            navigation.navigate(
                                UIText["profileScreen"]["barTitle"]
                            )
                        }
                    >
                        <SimpleLineIcons name="user" size={18} color="black" />
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                            navigation.navigate(
                                UIText["settingsScreen"]["barTitle"]
                            )
                        }
                    >
                        <SimpleLineIcons
                            name="settings"
                            size={18}
                            color="black"
                        />
                    </TouchableOpacity> */}

                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <SimpleLineIcons
                            name="logout"
                            size={18}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const enterChat = (id, chatName) => {
        navigation.navigate("chat", {
            id,
            chatName,
        });
    };

    return (
        <SafeAreaView style={styles.main}>
            <StatusBar style="light" />

            {!Error || chats.length > 1 ? (
                <ScrollView style={styles.container}>
                    {chats.map(({ id, chatName }) => (
                        <CustomListItem
                            key={id}
                            id={id}
                            chatName={chatName}
                            enterChat={enterChat}
                        />
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.containerStatic}>
                    <Text
                        style={{
                            fontSize: 40,
                            color: "gray",
                            textAlign: "center",
                        }}
                    >
                        {"(×﹏×)"}
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            color: "gray",
                            textAlign: "center",
                            fontFamily:
                                Platform.OS === "ios" ? "Courier" : "monospace",
                        }}
                    >
                        {UIText["errors"]["noChats"]}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
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
    main: {
        flex: 1,
        color: "black",
        backgroundColor: "black",
    },
});
