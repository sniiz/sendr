import React from "react";
import { Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import EmailVerifyScreen from "./screens/EmailVerifyScreen";
// import SettingsScreen from "./screens/SettingsScreen"; // wip screen
import UIText from "./components/LocalizedText";
import ProfileScreen from "./screens/ProfileScreen";
import { LogBox } from "react-native";
import _ from "lodash";

LogBox.ignoreLogs(["Warning:..."]); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = (message) => {
    if (message.indexOf("Setting a timer") <= -1) {
        _console.warn(message);
    }
};

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
    headerStyle: { backgroundColor: "white" },
    headerTitleStyle: { color: "black", fontWeight: "bold" },
    headerTintColor: "white",
};

export default function App() {
    return (
        <NavigationContainer style={styles.container}>
            {/* TODO add some cool transition between screens on android */}
            <Stack.Navigator screenOptions={globalScreenOptions}>
                <Stack.Screen
                    name={UIText["loginScreen"]["barTitle"]}
                    component={LoginScreen}
                />
                <Stack.Screen
                    name={UIText["signUpScreen"]["barTitle"]}
                    component={RegisterScreen}
                />
                <Stack.Screen name="home" component={HomeScreen} />
                <Stack.Screen
                    name={UIText["newChatScreen"]["barTitle"]}
                    component={AddChatScreen}
                />
                <Stack.Screen name="chat" component={ChatScreen} />
                {/* <Stack.Screen
                    name={UIText["settingsScreen"]["barTitle"]}
                    component={SettingsScreen}
                /> */}
                <Stack.Screen
                    name={UIText["profileScreen"]["barTitle"]}
                    component={ProfileScreen}
                />
                {/* <Stack.Screen
                    name={UIText["emailVerifyScreen"]["barTitle"]}
                    component={EmailVerifyScreen}
                /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontFamily: Platform.OS === "ios" ? "Arial" : "monospace", // TODO find a monospace ios font
    },
});
