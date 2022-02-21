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
import EStyleSheet from "react-native-extended-stylesheet";

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

function analyzeemail(email) {
    if (!email.includes("@")) {
        textgood = false;
        return "please enter a valid email.";
    } else if (!email.includes(".")) {
        textgood = false;
        return "please enter a valid email.";
    } else {
        textgood = true;
    }
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
    const [email, setMail] = useState("");
    const [password, setPass] = useState("");
    return (
        <SafeAreaView style={styleslogin.container}>
            <FadeInView>
                <Text style={styleslogin.version}>v0.2.83b</Text>
                <Text style={styleslogin.wee}>
                    ✨ i hate everything version ✨
                </Text>
                <Text style={styleslogin.Text}>log into sendr.</Text>
                <View style={styleslogin.tbox}>
                    <TextInput
                        style={styleslogin.input}
                        onChangeText={(newText) => setMail(newText)}
                        placeholder="email"
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styleslogin.input}
                        onChangeText={(newText) => setPass(newText)}
                        placeholder="password"
                        placeholderTextColor="gray"
                    />
                    <Text style={styleslogin.errortext}>
                        {analyzeemail(email)}
                    </Text>
                    <TouchableHighlight
                        onPress={() => {
                            loggedin(navigation, email, password);
                        }}
                    >
                        <Text style={styleslogin.proceed}>👉log in</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => {
                            loggedin(navigation, email, password);
                        }}
                    >
                        <Text style={styleslogin.noacc}>
                            🔐don't have an account?
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => {
                            loggedin(navigation, email, password);
                        }}
                    >
                        <Text style={styleslogin.hacc}>
                            🧑‍💻proceed anonymously
                        </Text>
                    </TouchableHighlight>
                </View>
            </FadeInView>
        </SafeAreaView>
    );
};

const styleslogin = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: colors.main,
        alignItems: "center",
        justifyContent: "center",
    },
    Text: {
        color: colors.accent,
        fontSize: 70,
        fontWeight: "bold",
        marginBottom: 10,
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
        marginLeft: 20,
        fontWeight: "normal",
        width: 400,
        fontSize: 30,
        textAlign: "center",
        marginBottom: 10,
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
    noacc: {
        paddingTop: 10,
        color: colors.accent,
        width: 10,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "right",
        marginRight: 10,
        width: "auto",
    },
    hacc: {
        paddingTop: 10,
        color: colors.accent,
        width: 10,
        fontSize: 20,
        fontWeight: "bold",
        fontStyle: "italic",
        textAlign: "right",
        marginRight: 10,
        width: "auto",
    },
});

export default Login;
