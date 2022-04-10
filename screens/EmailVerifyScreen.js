import {
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    View,
    Platform,
    TouchableOpacity,
} from "react-native";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "../firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import UIText from "../components/LocalizedText";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

const version = require("../assets/version-info.json");

export default function EmailVerifyScreen({ navigation }) {
    // TODO email verification
    const auth = getAuth();

    useEffect(() => {
        if (auth.currentUser) {
            if (auth.currentUser.emailVerified) {
                navigation.navigate(UIText["homeScreen"]["barTitle"]);
            }
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerTitleAlign: "center",
        });
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Text style={styles.version}>
                v{version.number}
                {"\n"}✨ {version.name} ✨
            </Text>
            <Text style={styles.title}>
                {UIText["emailVerifyScreen"]["title"]}
            </Text>
            <TouchableOpacity
                onPress={async () => {
                    await sendEmailVerification(auth.currentUser).then(() => {
                        // navigation.navigate("home");
                        console.log("sent");
                    });
                }}
            >
                <Text style={styles.text}>
                    {UIText["emailVerifyScreen"]["verifyButton"]}
                </Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>
                {UIText["emailVerifyScreen"]["didNotReceiveEmail"]}
            </Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    version: {
        color: "gray",
        fontSize: 10,
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: 20,
        fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
    },
    subtitle: {
        color: "gray",
        fontSize: 15,
        textAlign: "center",
    },
    title: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    text: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
        textAlign: "center",
    },
});
