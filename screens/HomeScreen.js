import { StatusBar } from "expo-status-bar";
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
    Alert,
    TouchableOpacity,
    Linking,
    Platform,
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
    getFirestore,
    onSnapshot,
} from "../firebase";
// sorry firebase is gitignored im scared of .envs
import UIText from "../components/LocalizedText";
import { Popable } from "react-native-popable";
import { ActivityIndicator } from "react-native-web";

const version = require("../assets/version-info.json");

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [Error, setError] = useState(false);
    const auth = getAuth();
    const db = getFirestore();

    // const signOutUser = () => {
    //     signOut(auth).then(() =>
    //         navigation.replace(UIText["loginScreen"]["barTitle"])
    //     );
    // };

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "chats"), orderBy("chatName")),
            (snapshot) => {
                setChats(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        name: doc.chatName,
                        ...doc.data(),
                    }))
                );
            },
            (error) => {
                setError(true);
                console.log(error);
            }
        );
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigation.replace(UIText["loginScreen"]["barTitle"]);
            } else if (!user.emailVerified) {
                navigation.replace(UIText["emailVerifyScreen"]["barTitle"]);
            }
        });
        return () => {
            unsubscribe();
            unsubAuth();
        };
    }, []);

    useEffect(() => {
        if (!auth.currentUser.emailVerified) {
            navigation.navigate(UIText["emailVerifyScreen"]["barTitle"]);
        }
    });

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
                                window.open(
                                    "https://github.com/sniiz/sendr",
                                    "_blank"
                                );
                            } else {
                                Linking.openURL(
                                    "https://github.com/sniiz/sendr"
                                );
                            }
                        }}
                    >
                        {/* <TouchableOpacity activeOpacity={0.5}>
                        <Avatar
                            rounded
                            source={{ uri: auth?.currentUser?.photoURL }}
                        />
                    </TouchableOpacity> */}

                        <Text
                            style={{
                                fontSize: 10,
                                fontStyle: "italic",
                                fontFamily:
                                    Platform.OS === "ios"
                                        ? "Courier New"
                                        : "monospace",
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
                            <SimpleLineIcons
                                name="share-alt"
                                size={10}
                                color="gray"
                            />
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
                                alert(
                                    "👀 friends and direct messages are coming soon! (i know we've been saying this forever but just trust us)"
                                );
                            }}
                        >
                            <SimpleLineIcons
                                name="user"
                                size={18}
                                color="#555"
                            />
                        </TouchableOpacity>
                    </Popable>

                    <Popable
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
                            onPress={() =>
                                navigation.navigate(
                                    UIText["newChatScreen"]["barTitle"]
                                )
                            }
                        >
                            <SimpleLineIcons
                                name="pencil"
                                size={18}
                                color="white"
                            />
                        </TouchableOpacity>
                    </Popable>

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
                            onPress={() =>
                                navigation.navigate(
                                    UIText["settingsScreen"]["barTitle"]
                                )
                            }
                        >
                            <SimpleLineIcons
                                name="settings"
                                size={18}
                                color="white"
                            />
                        </TouchableOpacity>
                    </Popable>

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

                    {/* <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <SimpleLineIcons
                            name="logout"
                            size={18}
                            color="black"
                        />
                    </TouchableOpacity> */}
                </View>
            ),
        });
    }, [navigation]);

    const enterChat = (id, chatName) => {
        // unsubscribe();
        navigation.navigate("chat", {
            id,
            chatName,
        });
    };

    return (
        <SafeAreaView style={styles.main}>
            <StatusBar style="light" />

            {
                // oh no what a mess
                !Error && chats.length > 0 ? (
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
                                fontFamily:
                                    Platform.OS === "ios"
                                        ? "Courier"
                                        : "monospace",
                                fontStyle: "italic",
                            }}
                        >
                            {UIText["errors"]["noChats"]}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.containerStatic}>
                        {/* <Text
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
                                fontFamily:
                                    Platform.OS === "ios"
                                        ? "Courier"
                                        : "monospace",
                                fontStyle: "italic",
                            }}
                        >
                            {
                                UIText["homeScreen"][
                                    `lonely${Math.floor(Math.random() * 6) + 1}`
                                ]
                            }
                        </Text> */}
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                )
            }
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
