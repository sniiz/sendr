import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Avatar } from "react-native-elements";
import {
    addDoc,
    collection,
    getAuth,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "../firebase";
import EmojiPicker from "rn-emoji-keyboard";
import { SimpleLineIcons } from "@expo/vector-icons";
// import * as Device from "expo-device";
// import Spinner from "react-native-ios-kit";
// import database from "@react-native-firebase/database";

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//     }),
// });

// registerForPushNotificationsAsync = async () => {
//     if (Device.isDevice) {
//         const { status: existingStatus } =
//             await Notifications.getPermissionsAsync();
//         let finalStatus = existingStatus;
//         if (existingStatus !== "granted") {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//         }
//         if (finalStatus !== "granted") {
//             alert("Failed to get push token for push notification!");
//             return;
//         }
//         const token = (await Notifications.getExpoPushTokenAsync()).data;
//         console.log(token);
//         this.setState({ expoPushToken: token });
//     } else {
//         alert("Must use physical device for Push Notifications");
//     }

//     if (Platform.OS === "android") {
//         Notifications.setNotificationChannelAsync("default", {
//             name: "default",
//             importance: Notifications.AndroidImportance.MAX,
//             vibrationPattern: [0, 250, 250, 250],
//             lightColor: "#FF231F7C",
//         });
//     }
// };

// async function sendPushNotification(
//     expoPushToken,
//     messageContent,
//     author,
//     chatName,
//     chatId
// ) {
//     const message = {
//         to: expoPushToken,
//         sound: "default",
//         title: chatName,
//         body: `${author}: ${messageContent}`,
//     };

//     await fetch("https://exp.host/--/api/v2/push/send", {
//         method: "POST",
//         headers: {
//             Accept: "application/json",
//             "Accept-encoding": "gzip, deflate",
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(message),
//     });
// }

const ChatScreen = ({ navigation, route }) => {
    const [msgInput, setMsgInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [usersOnline, setUsersOnline] = useState([]);
    const flatListRef = useRef(null);
    // const [expoPushToken, setExpoPushToken] = useState("");
    // const [notification, setNotification] = useState(false);
    // const notificationListener = useRef();
    // const responseListener = useRef();
    const auth = getAuth();
    const db = getFirestore();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: "black" },
            headerTitle: route.params.chatName,

            headerTintColor: "white",
            headerTitleAlign: "center",
        });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, `chats/${route.params.id}`, "messages"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => {
                const messages = [];
                snapshot.forEach((doc) => {
                    messages.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setMessages(messages.reverse());
            }
        );
        return () => {
            unsubscribe();
        };
    }, [route]);

    const sendMsg = () => {
        if (msgInput.length > 0) {
            Keyboard.dismiss();
            setSending(true);

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: Date.now().toString(),
                    timestamp: serverTimestamp(),
                    message: msgInput,
                    displayName: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                },
            ]);
            setMsgInput("");
            addDoc(collection(db, `chats/${route.params.id}`, "messages"), {
                timestamp: serverTimestamp(),
                message: msgInput,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                // photoURL: auth.currentUser.photoURL,
            })
                .then(() => {
                    setSending(false);
                    flatListRef.current.scrollToEnd();
                })
                .catch((error) => alert(error.message));
        }
    };

    // const unsub = onSnapshot(
    //     query(
    //         collection(db, `chats/${route.params.id}`, "messages"),
    //         orderBy("timestamp", "desc")
    //     ),
    //     (snapshot) => {
    //         setMessages(
    //             snapshot.docs.reverse().map((doc) => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }))
    //         );
    //         // if (lastSnapshot !== snapshot) {
    //         //     sendPushNotification(
    //         //         expoPushToken,
    //         //         snapshot.docs[0].data().message,
    //         //         snapshot.docs[0].data().displayName,
    //         //         route.params.name,
    //         //         route.params.id
    //         //     );
    //         // }
    //         // lastSnapshot = snapshot;
    //         // TODO notifications ffs D:<
    //     },
    //     (error) => {
    //         alert(`${UIText["errors"]["serverBody"]}, ${error.message}`);
    //     }
    // )[route];

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "black",
            }}
        >
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} // confused haley noises
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <FlatList
                            // inverted
                            // data={[...messages].reverse()}
                            data={messages}
                            ref={flatListRef}
                            onContentSizeChange={() =>
                                flatListRef.current.scrollToEnd({
                                    animated: true,
                                })
                            }
                            onLayout={() =>
                                flatListRef.current.scrollToEnd({
                                    animated: true,
                                })
                            }
                            // initialScrollIndex={messages.length - 1}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                return item.email === auth.currentUser.email ? (
                                    <View
                                        key={item.id}
                                        style={{
                                            alignItems: "flex-start",
                                            flexDirection: "row",
                                            borderBottomColor: "#aaa",
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <View style={styles.receiver}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                }}
                                            >
                                                {item.photoURL ? (
                                                    <Avatar
                                                        rounded
                                                        source={{
                                                            uri: item.photoURL,
                                                        }}
                                                        style={{
                                                            margin: 10,
                                                        }}
                                                        size={30}
                                                        // bottom={10}
                                                        // position="absolute"
                                                    />
                                                ) : null}
                                            </View>
                                            <View
                                                style={{
                                                    marginLeft: item.photoURL
                                                        ? 30
                                                        : 0,
                                                }}
                                            >
                                                <Text
                                                    style={styles.receiverName}
                                                >
                                                    {item.displayName}
                                                </Text>
                                                <Text
                                                    style={styles.receiverText}
                                                >
                                                    {item.message}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View
                                        key={item.id}
                                        style={{
                                            alignItems: "flex-start",
                                            borderBottomColor: "#333",
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <View style={styles.sender}>
                                            {item.photoURL ? (
                                                <Avatar
                                                    rounded
                                                    source={{
                                                        uri: item.photoURL,
                                                    }}
                                                    size={30}
                                                    position="absolute"
                                                    bottom={-15}
                                                    right={-5}
                                                    // containerStyle={{
                                                    //     position: "absolute",
                                                    //     bottom: -15,
                                                    //     right: -5,
                                                    // }}
                                                />
                                            ) : null}
                                            <View
                                                style={{
                                                    marginLeft: item.photoURL
                                                        ? 50
                                                        : 0,
                                                }}
                                            >
                                                <Text style={styles.senderName}>
                                                    {item.displayName}
                                                </Text>
                                                <Text style={styles.senderText}>
                                                    {item.message}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                        <View style={styles.footer}>
                            <TouchableOpacity
                                onPress={() => {
                                    setEmojiPicker(!emojiPicker);
                                }}
                                activeOpacity={0.8}
                            >
                                <SimpleLineIcons
                                    name="emotsmile"
                                    size={20}
                                    color="white"
                                    style={{
                                        marginRight: 15,
                                    }}
                                />
                            </TouchableOpacity>
                            <TextInput // occasinally layers behind keyboard on android
                                // (why is android so jank)
                                // FIXME chat footer on android
                                placeholder="type something..."
                                placeholderTextColor="grey"
                                style={styles.textInput}
                                value={msgInput}
                                onChangeText={(text) => setMsgInput(text)}
                                onSubmitEditing={sendMsg}
                            />
                            {sending ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <TouchableOpacity
                                    onPress={sendMsg}
                                    activeOpacity={0.5}
                                >
                                    <Text style={styles.sendbutton}>send</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <EmojiPicker
                            onEmojiSelected={(emoji) => {
                                setMsgInput(msgInput + emoji["emoji"]);
                                console.log(JSON.stringify(emoji));
                            }}
                            showSearchBar={false}
                            showHistory={false}
                            showTabs={false}
                            open={emojiPicker}
                            onClose={() => setEmojiPicker(false)}
                            // backdropColor="black"
                            categoryColor="white"
                            categoryContainerColor="black"
                            activeCategoryColor="black"
                            searchBarPlaceholderColor="grey"
                            searchBarContainerStyle={{
                                backgroundColor: "black",
                            }}
                            containerStyles={{
                                backgroundColor: "black",
                            }}
                            headerStyles={{
                                color: "white",
                                fontWeight: "bold",
                            }}
                        />
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
        borderWidth: 1,
        borderColor: "white",
    },
    receiverText: {
        color: "black",
        fontWeight: "normal",
        marginLeft: 10,
    },
    createdText: {
        color: "grey",
        // fontWeight: "light",
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
        // borderWidth: 1,
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
