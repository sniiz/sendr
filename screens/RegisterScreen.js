import React, { useLayoutEffect, useState } from "react";
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import { CoolButton, Header, Loading } from "../components/CustomUi";
import { Button, Input, Text } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "../firebase";
import UIText from "../components/LocalizedText";

const version = require("../assets/version-info.json");
const RegisterScreen = ({ navigation }) => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imgurl, setImgurl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: "black" },

            headerTintColor: "white",
            headerTitleAlign: "center",
        });
    }, [navigation]);

    const register = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((authUser) => {
                const user = authUser.user;
                updateProfile(user, {
                    displayName: fullname,
                    // photoURL: imgurl,
                })
                    .then(() => {
                        console.log("profile updated");
                        // navigation.navigate(
                        //     UIText["emailVerifyScreen"]["barTitle"]
                        // );
                        // TODO email verification
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            })
            .catch((error) => alert(error.message));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <StatusBar />
            <Text style={styles.version}>
                {version.number}
                {"\n"}✨ {version.name} ✨
            </Text>
            <Header
                style={{
                    color: "white",
                    fontSize: 40,
                    fontWeight: "normal",
                    textAlign: "center",
                    overflow: "visible",
                    marginBottom: 25,
                }}
            >
                {UIText["signUpScreen"]["title"]}
            </Header>

            <View style={styles.inputContainer}>
                <Input
                    placeholder={UIText["signUpScreen"]["nicknamePlaceholder"]}
                    autoFocus
                    style={styles.input}
                    type="text"
                    placeholderTextColor="gray"
                    value={fullname}
                    onChangeText={(text) => setFullname(text)}
                />
                <Input
                    placeholder={UIText["signUpScreen"]["emailPlaceholder"]}
                    style={styles.input}
                    type="email"
                    placeholderTextColor="gray"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    placeholder={UIText["signUpScreen"]["passwordPlaceholder"]}
                    secureTextEntry
                    style={styles.input}
                    type="password"
                    placeholderTextColor="gray"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                {/* <Input // TODO add image picker bc urls suck
                    placeholder={UIText["signUpScreen"]["pfpPlaceholder"]}
                    style={styles.input}
                    type="text"
                    placeholderTextColor="gray"
                    value={imgurl}
                    onChangeText={(text) => setImgurl(text)}
                /> */}
            </View>
            <Text
                style={[
                    styles.version,
                    {
                        marginTop: Platform.OS === "web" ? -5 : -15,
                        fontSize: 13,
                    },
                ]}
            >
                {UIText["signUpScreen"]["disclaimer"]}
            </Text>

            <TouchableWithoutFeedback onPress={register}>
                <Text style={styles.login}>
                    {UIText["signUpScreen"]["signUpButton"]}
                </Text>
            </TouchableWithoutFeedback>
            {/* <View style={{ height: 1 }} /> */}
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    ImageDimension: {
        width: 100,
        height: 100,
    },
    inputContainer: {
        width: 320,
        marginVertical: 10,
    },
    version: {
        color: "gray",
        fontSize: 10,
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: 20,
        fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
    },
    issue: {
        color: "red",
        fontSize: 10,
        textAlign: "center",
        fontStyle: "italic",
    },
    button: {
        width: 200,
        marginTop: 10,
    },
    login: {
        color: "white",
        fontSize: 30,
        marginTop: -10,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    input: {
        color: "white",
        borderWidth: 1,
        borderColor: "white",
        padding: 10,
        marginTop: Platform.OS === "web" ? 0 : -10,
        textAlign: "left",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        paddingBottom: 10,
        backgroundColor: "black",
    },
});
