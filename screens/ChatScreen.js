import { SimpleLineIcons } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import EmojiPicker from "rn-emoji-keyboard";
import UIText from "../components/LocalizedText";
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

const ChatScreen = ({ navigation, route }) => {
    const [msgInput, setMsgInput] = useState("");

    const [messages, setMessages] = useState([]);
    const [usersOnline, setUsersOnline] = useState([]);

    const [sending, setSending] = useState(false);
    const [emojiPicker, setEmojiPicker] = useState(false);

    const [repliedId, setRepliedId] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const flatListRef = useRef(null);

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
                flatListRef.current.scrollToEnd({
                    animated: false,
                });
            }
        );
        return () => {
            unsubscribe();
        };
    }, [route]);

    const sendMsg = () => {
        if (!editingId) {
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
                    referenceId: repliedId,
                },
            ]);
            setMsgInput("");
            setEditingId(null);
            addDoc(collection(db, `chats/${route.params.id}`, "messages"), {
                timestamp: serverTimestamp(),
                message: msgInput,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                referenceId: repliedId,
                // photoURL: auth.currentUser.photoURL,
            })
                .then(() => {
                    setSending(false);
                    setRepliedId(null);
                    flatListRef.current.scrollToEnd({
                        animated: false,
                    });
                })
                .catch((error) => alert(error.message));
        } else {
            // wip
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "black",
            }}
        >
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <FlatList
                            data={messages}
                            ref={flatListRef}
                            onLayout={() =>
                                flatListRef.current.scrollToEnd({
                                    animated: true,
                                })
                            }
                            onContentSizeChange={() =>
                                flatListRef.current.scrollToEnd({
                                    animated: false,
                                })
                            }
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) =>
                                item.email === auth.currentUser.email ? (
                                    <View
                                        key={item.id}
                                        style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                            borderBottomColor: "#aaa",
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <View style={styles.receiver}>
                                            <View
                                                style={{
                                                    marginLeft: item.photoURL
                                                        ? 30
                                                        : 0,
                                                }}
                                            >
                                                {item.referenceId !== null ? (
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            flatListRef.current.scrollToIndex(
                                                                {
                                                                    index: item.referenceId,
                                                                    animated: true,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.receiverName
                                                            }
                                                        >
                                                            <SimpleLineIcons
                                                                name="arrow-up"
                                                                size={5}
                                                                color="gray"
                                                            />{" "}
                                                            {
                                                                messages.find(
                                                                    (
                                                                        message
                                                                    ) => {
                                                                        message.id ===
                                                                            item.referenceId;
                                                                    }
                                                                )?.displayName
                                                            }
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : null}
                                                <Text
                                                    style={styles.receiverName}
                                                >
                                                    {item.displayName}
                                                    {" · "}
                                                    {new Date(
                                                        item?.timestamp
                                                            ?.seconds * 1000
                                                    ).toLocaleDateString(
                                                        Localization.locale,
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                        }
                                                    )}
                                                </Text>
                                                <Text
                                                    style={styles.receiverText}
                                                >
                                                    {item.message}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    alignSelf: "flex-end",
                                                    position: "absolute",
                                                }}
                                                onPress={() => {
                                                    setRepliedId(item.id);
                                                    setEditingId(item.id);
                                                }}
                                            >
                                                <SimpleLineIcons
                                                    name="options-vertical"
                                                    size={10}
                                                    color="gray"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View
                                        key={item.id}
                                        style={{
                                            alignItems: "center",
                                            borderBottomColor: "#333",
                                            borderBottomWidth: 1,
                                        }}
                                    >
                                        <View style={styles.sender}>
                                            <View
                                                style={{
                                                    marginLeft: item.photoURL
                                                        ? 30
                                                        : 0,
                                                }}
                                            >
                                                {item.referenceId !== null ? (
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            flatListRef.current.scrollToIndex(
                                                                {
                                                                    index: item.referenceId,
                                                                    animated: true,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.senderName
                                                            }
                                                        >
                                                            <SimpleLineIcons
                                                                name="arrow-up"
                                                                size={5}
                                                                color="gray"
                                                            />{" "}
                                                            {
                                                                messages.find(
                                                                    (
                                                                        message
                                                                    ) => {
                                                                        message.id ===
                                                                            item.referenceId;
                                                                    }
                                                                )?.displayName
                                                            }
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : null}
                                                }
                                                <Text style={styles.senderName}>
                                                    {item.displayName}
                                                    {" · "}
                                                    {new Date(
                                                        item.timestamp.seconds *
                                                            1000
                                                    ).toLocaleDateString(
                                                        Localization.locale,
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                        }
                                                    )}
                                                </Text>
                                                <Text style={styles.senderText}>
                                                    {item.message}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    alignSelf: "flex-end",
                                                    position: "absolute",
                                                }}
                                                onPress={() => {
                                                    setRepliedId(item.id);
                                                    setEditingId(item.id);
                                                }}
                                            >
                                                <SimpleLineIcons
                                                    name="options-vertical"
                                                    size={10}
                                                    color="gray"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }
                        />
                        {repliedId ? (
                            <View
                                style={[
                                    styles.replyFooter,
                                    {
                                        backgroundColor:
                                            messages.find(
                                                (message) =>
                                                    message.id === repliedId
                                            )?.email === auth.currentUser.email
                                                ? "white"
                                                : "black",
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => setRepliedId(null)}
                                >
                                    <SimpleLineIcons
                                        name="arrow-down"
                                        size={15}
                                        color="gray"
                                        style={{ marginRight: 10 }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: "gray",
                                    }}
                                >
                                    replying to{" "}
                                    {messages.find(
                                        (message) => message.id === repliedId
                                    )?.displayName ===
                                    auth.currentUser.displayName
                                        ? "yourself"
                                        : messages.find(
                                              (message) =>
                                                  message.id === repliedId
                                          )?.displayName}
                                    :{" "}
                                    <Text style={{ color: "gray" }}>
                                        {messages.find(
                                            (message) =>
                                                message.id === repliedId
                                        )?.message ?? "_"}
                                    </Text>
                                </Text>
                            </View>
                        ) : null}
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
                            <TextInput
                                placeholder={
                                    UIText["chatScreen"]["inputPlaceholder"]
                                }
                                textContentType="none"
                                placeholderTextColor="grey"
                                style={styles.textInput}
                                value={msgInput}
                                onChangeText={(text) => setMsgInput(text)}
                                onSubmitEditing={sendMsg}
                            />
                            {sending ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : msgInput !== "" ? (
                                <TouchableOpacity
                                    onPress={sendMsg}
                                    activeOpacity={0.5}
                                >
                                    <SimpleLineIcons
                                        name="paper-plane"
                                        size={20}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            ) : null}
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
    replyFooter: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
        paddingVertical: 10,
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
        // marginLeft: 10,
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
        // marginLeft: 10,
        // marginBottom: 15,
    },
    receiver: {
        padding: 15,
        paddingLeft: 30,
        backgroundColor: "white",
        alignItems: "flex-start",
        width: "100%",
        marginVertical: 0,
        position: "relative",
    },
    sender: {
        padding: 15,
        paddingLeft: 30,
        alignItems: "flex-start",
        width: "100%",
        marginVertical: 0,
        position: "relative",
    },
    senderName: {
        // left: 10,
        // paddingRight: 10,
        marginLeft: -5,
        fontSize: 10,
        color: "grey",
    },
    receiverName: {
        // left: 10,
        // paddingRight: 10,
        marginLeft: -5,
        fontSize: 10,
        color: "grey",
    },
});
