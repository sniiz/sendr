import React, { useState, useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const store = async (prefs) => {
    const jsonvalue = JSON.stringify(prefs);
    await AsyncStorage.setItem("preferences", jsonvalue);
};

const read = async () => {
    const jsonvalue = await AsyncStorage.getItem("preferences");
    return jsonvalue != null ? JSON.parse(jsonvalue) : null;
};

var defsettings = require("./assets/preferences.json");
var messages = require("./demos/messages.json");
//var uitext = require("./assets/en-lang.json");

const { width, height } = Dimensions.get("window"); //probably wont use this but hey just in case
var errortxt = "";
var textgood = false;
const goodletters = /([^a-zA-Z._0123456789-])/;

try {
    read(prefs);
} catch {
    defsettings["uid"] = makeid(7); //UID LENGTH: 7 SYMBOLS (note to self: dont forget this you dingus)
    store(defsettings);
}

var colors = require(`./assets/${read()["theme"]}.json`);

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

function loggedin(nav, txt) {
    var nick = txt;
    if (textgood) {
        console.log(nick);
        nav.navigate("chat");
    }
}

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

function Login({ navigation }) {
    const [text, setText] = useState("");
    return (
        <SafeAreaView style={styleslogin.container}>
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
        </SafeAreaView>
    );
}

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
