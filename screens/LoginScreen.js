import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Platform,
    Text,
} from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "../firebase";
import UIText from "../components/LocalizedText";

const logo = require("../assets/wip_logo_white.png");
const version = require("../assets/version-info.json");

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCorrect, setPasswordCorrect] = useState(true);
    const auth = getAuth();

    useEffect(
        () =>
            onAuthStateChanged(auth, (user) => {
                if (user) navigation.replace("home");
            }),
        []
    );

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password).catch((error) => {
            if (error.message.includes("password")) {
                setPasswordCorrect(false);
            }
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} // FIXME occasionally glitches out on android
            style={styles.container}
        >
            <StatusBar style="light" />
            <Text style={styles.version}>
                v{version.number}
                {"\n"}✨ {version.name} ✨
            </Text>
            <Text style={styles.title}>{UIText["loginScreen"]["title"]}</Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder={UIText["loginScreen"]["emailPlaceholder"]}
                    style={styles.input}
                    autoFocus
                    type="email"
                    placeholderTextColor="gray"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    placeholder={UIText["loginScreen"]["passwordPlaceholder"]}
                    secureTextEntry
                    type="password"
                    style={styles.input}
                    value={password}
                    placeholderTextColor="gray"
                    onChangeText={(text) => setPassword(text)}
                    onSubmitEditing={signIn}
                />
                <Text style={styles.errorText}>
                    {passwordCorrect
                        ? ""
                        : UIText["loginScreen"]["passwordError"]}
                </Text>
            </View>

            <View style={styles.elbutton}>
                <TouchableWithoutFeedback onPress={signIn}>
                    <Text style={styles.login}>
                        {UIText["loginScreen"]["loginButton"]}
                    </Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() =>
                        navigation.navigate(UIText["signUpScreen"]["barTitle"])
                    }
                >
                    <Text style={styles.noacc}>
                        {UIText["loginScreen"]["signUpButton"]}
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    ImageDimension: {
        width: 200,
        height: 200,
    },
    inputContainer: {
        width: 320,
        marginVertical: 10,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        color: "white",
        backgroundColor: "black",
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: -15,
        textAlign: "center",
        fontStyle: "italic",
    },
    noacc: {
        color: "#f0f0f0",
        fontSize: 17,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "right",
        overflow: "visible",
    },
    main: {
        flex: 1,
        backgroundColor: "black",
    },
    login: {
        color: "white",
        fontSize: 25,
        marginBottom: 20,
        marginTop: -10,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    title: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    elbutton: {
        alignItems: "center",
    },
    version: {
        color: "gray",
        fontSize: 10,
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: 20,
        fontFamily: "monospace",
    },
    input: {
        color: "white",
        borderWidth: 2,
        borderColor: "white",
        padding: 10,
        marginTop: 0,
        textAlign: "left",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: "black",
    },
});

export default LoginScreen;
