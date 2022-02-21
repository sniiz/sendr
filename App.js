import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    Animated,
    Dimensions,
    Platform,
    PixelRatio,
    StatusBar,
    Button,
    Image,
    FlatList,
    TouchableHighlight,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

EStyleSheet.build({
    // always call EStyleSheet.build() even if you don't use global variables!
    $textColor: "#0275d8",
});
import chat from "./components/chat";
import Login from "./components/loginscreen";
import generate from "./components/generatepfp";
import firebase from "./components/firebase";

var defsettings = require("./assets/preferences.json");
var messages = require("./demos/messages.json");

function makeid(length) {
    var result = "";
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

// var uitext = require("./assets/en-lang.json");

const { width, height } = Dimensions.get("window"); // probably wont use this but hey just in case (i am a brilliant programmer indeed)
var textgood = false;

var colors = require("./assets/light.json");

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

function Chat({ navigation }) {
    const Item = ({ content, username, time }) => (
        <View style={styleschat.message}>
            <Text style={styleschat.unametext}>
                {username} • {new Date(time * 1000).toString()}
            </Text>
            <Text style={styleschat.msgtext}>{content}</Text>
        </View>
    );
    const renderItem = ({ item }) => (
        <Item content={item.content} username={item.author} time={item.date} />
    );
    const [text, setText] = useState("");
    return (
        <View style={styleschat.container}>
            <FadeInView>
                <View style={styleschat.msgbox}>
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={styleschat.textboxbox}>
                    <TextInput
                        style={styleschat.input}
                        onChangeText={(newText) => setText(newText)}
                        defaultValue={text}
                        placeholder="say something..."
                        placeholderTextColor="gray"
                    />
                </View>
            </FadeInView>
        </View>
    );
}

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="login"
                    component={Login}
                    options={{ title: "log in" }}
                />
                <Stack.Screen
                    name="chat"
                    component={Chat}
                    options={{ title: "chat" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styleschat = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
        justifyContent: "flex-end",
    },
    msgbox: {
        // height: "100%",
        backgroundColor: colors.main,
        marginTop: 50,
        alignItems: "flex-end",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    input: {
        color: colors.main,
        backgroundColor: colors.accent,
        padding: 10,
        paddingVertical: 7,
        paddingLeft: 20,
        fontWeight: "normal",
        fontSize: 20,
        marginRight: 100,
        marginLeft: 10,
        marginVertical: 10,
        textAlign: "left",
        lineHeight: 50,
        borderRadius: 20,
    },
    Text: {
        color: colors.accent,
        fontSize: 70,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    textboxbox: {
        color: colors.accent,
    },
    message: {
        backgroundColor: colors.msgmain,
        padding: 20,
        marginVertical: 2,
        marginRight: 0,
    },
    ownmessage: {
        color: colors.accent,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    msgtext: {
        color: colors.accent,
        fontSize: 20,
        textAlign: "left",
    },
    unametext: {
        color: colors.accent,
        fontSize: 14,
        textAlign: "left",
    },
    ownmsgtext: {
        color: colors.main,
        fontSize: 20,
        textAlign: "left",
    },
});
