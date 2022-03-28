import React, { useLayoutEffect, useState } from "react";
import {
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { CoolButton } from "../components/CustomUi";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, addDoc, getFirestore, getAuth } from "../firebase";

const AddChatScreen = ({ navigation }) => {
    const [chat, setChat] = useState("");

    const createChat = async () => {
        if (chat === null) {
            return;
        }
        const db = getFirestore();
        const auth = getAuth();
        await addDoc(collection(db, "chats"), {
            chatName: chat,
            // createdBy: auth.currentUser.fullname,
        })
            .then(() => navigation.goBack())
            .catch((error) => alert(error.message));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "new chat",
            headerBackTitle: "back to chats",
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Input
                placeholder="chat name here"
                value={chat}
                style={styles.input}
                placeholderTextColor="gray"
                onChangeText={(text) => setChat(text)}
                onSubmitEditing={createChat}
            />
            <TouchableWithoutFeedback onPress={createChat}>
                <Text style={styles.button}>create ✍️</Text>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default AddChatScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        padding: 30,
        alignContent: "center",
        justifyContent: "center",
        paddingBottom: 90,
        flex: 1,
        height: "100%",
    },
    input: {
        color: "white",
        borderWidth: 2,
        borderColor: "white",
        padding: 10,
        marginTop: 0,
        textAlign: "left",
    },
    button: {
        color: "white",
        fontSize: 25,
        marginBottom: 20,
        marginTop: -10,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
});
