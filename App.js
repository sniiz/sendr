import React, {
    useState,
    useRef,
    useEffect,
    createContext,
    useLayoutEffect,
    useCallback,
} from "react";
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
    TouchableHighlight,
} from "react-native";
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
} from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    signInAnonymously,
    onAuthStateChanged,
    getAdditionalUserInfo,
    getAuth,
} from "firebase/auth";
import { auth, database } from "./config/firebase";

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

var id = makeid(7);

const store = async (prefs) => {
    const jsonvalue = JSON.stringify(prefs);
    await AsyncStorage.setItem("preferences", jsonvalue);
};

const read = async () => {
    const jsonvalue = await AsyncStorage.getItem("preferences");
    return jsonvalue != null ? JSON.parse(jsonvalue) : null;
};

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthenticatedUserContext.Provider value={{ user, setUser }}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};

var defsettings = require("./assets/preferences.json");
var messages = require("./demos/messages.json");
//var uitext = require("./assets/en-lang.json");

const { width, height } = Dimensions.get("window"); //probably wont use this but hey just in case
var errortxt = "";
var textgood = false;
const goodletters = /([^a-zA-Z._0123456789-])/;

// try {
//     read(prefs);
// } catch {
//     defsettings["uid"] = makeid(7); //UID LENGTH: 7 SYMBOLS (note to self: dont forget this you dingus)
//     store(defsettings);
// }

var colors = require("./assets/dark.json");

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
        signInAnonymously(getAuth())
            .then(() => {
                console.log("signed in successfully");
                nav.navigate("chat");
            })
            .catch((error) => {
                console.warn(error);
            });
    }
}

function analyzenick(nick) {
    if (nick.length >= 15) {
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
                <Text style={styleslogin.version}>v0.0.1pb</Text>
                <Text style={styleslogin.wee}>✨ public beta ✨</Text>
                <Text style={styleslogin.Text}>sendr.</Text>
                <View style={styleslogin.tbox}>
                    <TextInput
                        style={styleslogin.input}
                        onChangeText={(newText) => setText(newText)}
                        value={text}
                        placeholder="your username here"
                        placeholderTextColor="gray"
                    />
                    <Text style={styleslogin.errortext}>
                        {analyzenick(text)}
                    </Text>
                    <View style={styleslogin.elbutton}>
                        <TouchableHighlight
                            onPress={() => {
                                loggedin(navigation, text);
                            }}
                        >
                            <Text style={styleslogin.proceed}>👉submit</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </FadeInView>
        </SafeAreaView>
    );
}

function Chat({ navigation }) {
    useLayoutEffect(() => {
        const collectionRef = collection(database, "chats");
        const q = query(collectionRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setMessages(
                querySnapshot.docs.map((doc) => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                }))
            );
        });

        return unsubscribe;
    });

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, "chats"), {
            _id,
            createdAt,
            text,
            user,
        });
    }, []);

    const [messages, setMessages] = useState([]);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: auth?.currentUser?.uid,
            }}
        />
    );
    // const Item = ({ content, username, time }) => (
    //     <View style={styleschat.message}>
    //         <Text style={styleschat.unametext}>
    //             {username} • {new Date(time * 1000).toString()}
    //         </Text>
    //         <Text style={styleschat.msgtext}>{content}</Text>
    //     </View>
    // );
    // const renderItem = ({ item }) => (
    //     <Item content={item.content} username={item.author} time={item.date} />
    // );
    // const [text, setText] = useState("");
    // return (
    //     <View style={styleschat.container}>
    //         <FadeInView>
    //             <View style={styleschat.msgbox}>
    //                 <FlatList
    //                     data={messages}
    //                     renderItem={renderItem}
    //                     keyExtractor={(item) => item.id}
    //                 />
    //             </View>
    //             <View style={styleschat.textboxbox}>
    //                 <TextInput
    //                     style={styleschat.input}
    //                     onChangeText={(newText) => setText(newText)}
    //                     defaultValue={text}
    //                     placeholder="say something..."
    //                     placeholderTextColor="gray"
    //                 />
    //             </View>
    //         </FadeInView>
    //     </View>
    // );
}

function loading({ navigation }) {
    return (
        <SafeAreaView style={styleslogin.container}>
            <Text style={styleslogin.Text}>
                L + ratio + wrong + get a job + unfunny + you fell off + never
                liked you anyway + cope + ur allergic to gluten + don't care +
                cringe ur a kid + literally shut the fuck up + galileo did it
                better + your avi was made in MS Excel + ur bf is kinda ugly + i
                have more subscribers + owned + ur a toddler + reverse double
                take back + u sleep in a different bedroom from your wife + get
                rekt + i said it better + u smell + copy + who asked + dead game
                + seethe + no bitches + ur a coward + stay mad + you main yuumi
                + aired + you drive a fiat 500 + the hood watches xqc now + yo
                mama + ok + bozo + u suck + ratio + ratio + ratio + ratio + cry
                about it + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
                + ratio + ratio + ratio + ratio + ratio + ratio + ratio + ratio
            </Text>
        </SafeAreaView>
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
                    options={{ title: "log in", headerShown: false }}
                />
                <Stack.Screen
                    name="chat"
                    component={Chat}
                    options={{ title: "chat", headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styleslogin = StyleSheet.create({
    container: {
        flex: 1,
        padding: 90,
        backgroundColor: colors.main,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
    },
    tbox: {
        backgroundColor: colors.main,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
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
    elbutton: {
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    errortext: {
        color: "#f54242",
        fontSize: 13,
        textAlign: "center",
        paddingTop: 10,
    },
    input: {
        color: colors.accent,
        borderWidth: 5,
        borderColor: colors.accent,
        padding: 10,
        fontWeight: "normal",
        width: 300,
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
        alignSelf: "flex-start",
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
        color: colors.accent,
        borderColor: colors.accent,
        borderWidth: 5,
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
