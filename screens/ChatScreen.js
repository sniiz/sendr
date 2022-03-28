import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
    collection,
    addDoc,
    getFirestore,
    serverTimestamp,
    onSnapshot,
    getAuth,
    query,
    orderBy,
} from "../firebase";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

// set notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const ChatScreen = ({ navigation, route }) => {
    const [msgInput, setMsgInput] = useState("");
    const [messages, setMessages] = useState([]);
    const auth = getAuth();
    const db = getFirestore();

    const sendMsg = async () => {
        Keyboard.dismiss();

        await addDoc(collection(db, `chats/${route.params.id}`, "messages"), {
            timestamp: serverTimestamp(),
            message: msgInput,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        })
            .then(() => setMsgInput(""))
            .catch((error) => alert(error.message));
    };

    // TODO notifications
    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db, `chats/${route.params.id}`, "messages"),
                    orderBy("timestamp", "desc")
                ),
                (snapshot) => {
                    setMessages(
                        snapshot.docs.reverse().map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    );
                }
            ),
        [route]
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "sendr chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                    }}
                >
                    {messages[0]?.photoURL != null ? (
                        <Avatar
                            rounded
                            source={{ uri: messages[0]?.photoURL }}
                        />
                    ) : null}
                    <Text
                        style={{
                            color: "black",
                            // marginLeft: 10,
                            fontWeight: "bold",
                        }}
                    >
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    {/* <TouchableOpacity
                        onPress={Alert.alert(
                            "sendr",
                            "message attachements are not yet available."
                        )}
                    >
                        <FontAwesome
                            name="video-camera"
                            size="24"
                            color="red"
                        />
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity
                        onPress={Alert.alert(
                            "sendr",
                            "calls are not yet available."
                        )}
                    >
                        <Ionicons name="call" size="24" color="red" />
                    </TouchableOpacity> */}
                    {/* 👀 idk if firebase can actually handle calls */}
                    {/* TODO research firebase calls */}
                </View>
            ),
        });
    }, [navigation, messages]);

    const scrollViewRef = useRef();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "black",
            }}
        >
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} // confused haley noises
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView
                            contentContainerStyle={{}}
                            ref={scrollViewRef}
                            onContentSizeChange={() =>
                                scrollViewRef.current.scrollToEnd({
                                    animated: true,
                                })
                            }
                        >
                            <Text style={styles.createdText}>
                                {
                                    '{snapshot.collection(db, `chats/${route.params.chatid}.author["name"]`)} created {snapshot.collection(db, `chats/${route.params.chatid}.name`}'
                                }
                            </Text>
                            {messages.map((message) =>
                                message.email === auth.currentUser.email ? (
                                    <View
                                        key={message.id}
                                        style={{
                                            alignItems: "flex-start",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <View style={styles.receiver}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                }}
                                            >
                                                {message.photoURL ? (
                                                    <Avatar
                                                        rounded
                                                        source={{
                                                            uri: message.photoURL,
                                                        }}
                                                        size={30}
                                                        position="absolute"
                                                        left={5}
                                                    /> // FIXME wonky pfp positioning
                                                ) : null}
                                            </View>
                                            <Text style={styles.receiverName}>
                                                {message.displayName}
                                            </Text>
                                            <Text style={styles.receiverText}>
                                                {message.message}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View
                                        key={message.id}
                                        style={{ alignItems: "flex-start" }}
                                    >
                                        <View style={styles.sender}>
                                            {message.photoURL ? (
                                                <Avatar
                                                    rounded
                                                    source={{
                                                        uri: message.photoURL,
                                                    }}
                                                    size={30}
                                                    position="absolute"
                                                    bottom={-15}
                                                    right={-5}
                                                    containerStyle={{
                                                        position: "absolute",
                                                        bottom: -15,
                                                        right: -5,
                                                    }}
                                                /> // FIXME here too
                                            ) : null}
                                            <Text style={styles.senderName}>
                                                {message.displayName}
                                            </Text>
                                            <Text style={styles.senderText}>
                                                {message.message}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            )}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput // occasinally layers behind keyboard on android
                                // (why is android so jank)
                                placeholder="type something..."
                                placeholderTextColor="grey"
                                style={styles.textInput}
                                value={msgInput}
                                onChangeText={(text) => setMsgInput(text)}
                                onSubmitEditing={sendMsg}
                            />
                            <TouchableOpacity
                                onPress={sendMsg}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.sendbutton}>send</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    // a ton of these styles are probably unnecessary but idc
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        padding: 10,
        color: "white",
        borderWidth: 2,
        borderColor: "white",
    },
    receiverText: {
        color: "black",
        fontWeight: "normal",
        marginLeft: 10,
    },
    createdText: {
        color: "grey",
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 15,
        alignSelf: "center",
    },
    sendbutton: {
        color: "white",
    },
    senderText: {
        color: "white",
        fontWeight: "normal",
        marginLeft: 10,
        marginBottom: 15,
    },
    receiver: {
        padding: 10,
        paddingVertical: 7,
        backgroundColor: "white",
        alignItems: "flex-start",
        width: "100%",
        marginVertical: 0,
        position: "relative",
    },
    sender: {
        paddingVertical: 5,
        padding: 10,
        borderColor: "white",
        // borderWidth: 2,
        alignItems: "flex-start",
        width: "100%",
        position: "relative",
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "grey",
    },
    receiverName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: "grey",
    },
});
