import React, { useLayoutEffect, useState } from "react";
import {
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    View,
    TouchableWithoutFeedback,
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { CoolButton } from "../components/CustomUi";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, addDoc, getFirestore, getAuth } from "../firebase";
import UIText from "../components/LocalizedText";

const AddChatScreen = ({ navigation }) => {
    const [chat, setChat] = useState("");

    const createChat = async () => {
        const db = getFirestore();
        const auth = getAuth();
        await addDoc(collection(db, "chats"), {
            // chat info
            chatName: chat,
            // createdBy: auth.currentUser.fullname,
        })
            .then(() => navigation.goBack())
            .catch((error) => alert(error.message));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: UIText["newChatScreen"]["barTitle"],
            headerBackTitle: "back to chats",
            headerStyle: { backgroundColor: "black" },

            headerTintColor: "white",
            headerTitleAlign: "center",
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.inputContainer}>
                <Input
                    placeholder={UIText["newChatScreen"]["chatNamePlaceholder"]}
                    value={chat}
                    style={styles.input}
                    placeholderTextColor="gray"
                    onChangeText={(text) => setChat(text)}
                    onSubmitEditing={createChat}
                />
            </View>
            <TouchableWithoutFeedback onPress={createChat}>
                <Text style={styles.button}>
                    {UIText["newChatScreen"]["create"]} ✍️
                </Text>
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
        alignItems: "center",
        paddingBottom: 90,
        flex: 1,
        height: "100%",
    },
    input: {
        color: "white",
        borderWidth: 1,
        borderColor: "white",
        padding: 10,
        marginTop: 0,
        alignSelf: "center",
        textAlign: "left",
    },
    inputContainer: {
        width: 320,
        marginVertical: 10,
    },
    button: {
        color: "white",
        fontSize: 25,
        marginBottom: 20,
        // marginTop: -10,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
});
