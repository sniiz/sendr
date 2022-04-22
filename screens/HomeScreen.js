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
    getFirestore,
    onSnapshot,
} from "../firebase";
// sorry firebase is gitignored im scared of .envs
import UIText from "../components/LocalizedText";

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
            (error) => {
                setError(true);
            }
        );
        return () => unsubscribe();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "sendr",
            headerStyle: { backgroundColor: "black" },

            headerTintColor: "white",
            headerTitleAlign: "center",
            headerLeft: () => (
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
                            Linking.openURL("https://github.com/sniiz/sendr");
                        }
                    }}
                >
                    {/* <TouchableOpacity activeOpacity={0.5}>
                        <Avatar
                            rounded
                            source={{ uri: auth?.currentUser?.photoURL }}
                        />
                    </TouchableOpacity> */}
                    <SimpleLineIcons
                        name="social-github"
                        size={10}
                        color="gray"
                        style={{ marginLeft: 10 }}
                    />
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
                        {version["number"]}
                    </Text>
                </TouchableOpacity>
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
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            alert(
                                "👀 friends and direct messages are coming soon! (i know we've been saying this forever but just trust us)"
                            );
                        }}
                    >
                        <SimpleLineIcons name="user" size={18} color="white" />
                    </TouchableOpacity>
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
                !Error || chats.length > 1 ? (
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
    main: {
        flex: 1,
        color: "black",
        backgroundColor: "black",
    },
});
