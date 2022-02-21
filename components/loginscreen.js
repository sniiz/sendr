import React, { useState, useRef, useEffect } from "react";
import {
    Text,
    View,
    SafeAreaView,
    TextInput,
    Animated,
    TouchableHighlight,
    StyleSheet,
    KeyboardAvoidingView,
} from "react-native";

var colors = require("../assets/light.json");

const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={{
                ...props.style,
                opacity: fadeAnim,
            }}
        >
            {props.children}
        </Animated.View>
    );
};

function analyzenick(nick) {
    if (nick.length > 15) {
        textgood = false;
        return "please ensure your username is less than 15 characters long.";
    } else if (nick.length < 3) {
        textgood = false;
        return "please ensure your username is longer than 3 characters.";
    } else if (goodletters.test(nick)) {
        textgood = false;
        return "usernames can only include english letters, numbers,\ndots(.), underscores(_), and dashes(-).";
    } else if (nick.includes(" ")) {
        textgood = false;
        return "usernames can only include english letters, numbers,\ndots(.), underscores(_), and dashes(-).";
    } else textgood = true;
}

function loggedin(nav, txt) {
    var nick = txt;
    if (textgood) {
        // console.log(nick);
        nav.navigate("chat");
    }
}

const goodletters = /([^a-zA-Z._0123456789-])/;
var textgood = false;
const Login = ({ navigation }) => {
    const [text, setText] = useState("");
    return (
        <KeyboardAvoidingView style={styleslogin.container}>
            <FadeInView>
                <Text style={styleslogin.version}>v0.2.41b</Text>
                <Text style={styleslogin.wee}>✨ indev version ✨</Text>
                <Text style={styleslogin.Text}>sendr.</Text>
                <View style={styleslogin.tbox}>
                    <TextInput
                        style={styleslogin.input}
                        onChangeText={(newText) => setText(newText)}
                        defaultValue={text}
                        placeholder="your username here"
                        placeholderTextColor="gray"
                    />
                    <Text style={styleslogin.errortext}>
                        {analyzenick(text)}
                    </Text>
                    <TouchableHighlight
                        onPress={() => {
                            loggedin(navigation, text);
                        }}
                    >
                        <Text style={styleslogin.proceed}>👉submit</Text>
                    </TouchableHighlight>
                </View>
            </FadeInView>
        </KeyboardAvoidingView>
    );
};

const styleslogin = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 160,
    },
    Text: {
        color: colors.accent,
        fontSize: 70,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    version: {
        color: "gray",
        textAlign: "center",
        paddingTop: -20,
        //paddingBottom: 10,
    },
    wee: {
        color: "gray",
        textAlign: "center",
        fontStyle: "italic",
        paddingBottom: 30,
    },
    errortext: {
        color: "#f54242",
        fontSize: 13,
        textAlign: "center",
        paddingTop: 10,
    },
    input: {
        color: colors.main,
        backgroundColor: colors.accent,
        padding: 10,
        fontWeight: "normal",
        width: 400,
        fontSize: 30,
        textAlign: "center",
        lineHeight: 50,
        borderRadius: 20,
    },
    proceed: {
        paddingTop: 10,
        color: colors.accent,
        width: 10,
        fontSize: 30,
        fontWeight: "bold",
        width: "auto",
    },
});

export default Login;
