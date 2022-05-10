import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import EmailVerifyScreen from "./screens/EmailVerifyScreen";
import SettingsScreen from "./screens/SettingsScreen"; // wip screen
import UIText from "./components/LocalizedText";
import FriendsScreen from "./screens/FriendsScreen";
import * as Linking from "expo-linking";

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
    headerStyle: {
        backgroundColor: "black",
        borderBottomWidth: 1,
        borderBottomColor: "white",
    },
    headerTitleStyle: { color: "white", fontWeight: "light" },
    headerTintColor: "white",
    headerTitleAlign: "center",
};
const linking = {
    prefixes: [
        "localhost:19006",
        "https://sendrapp.vercel.app",
        "https://sendr-sniiz.vercel.app",
        Linking.createURL("/"),
    ],
    config: {
        screens: {
            login: "login",
            signUp: "sign-up",
            home: "home",
            newChat: "new-chat",
            chat: "chat",
            settings: "settings",
            verifyEmail: "verify-email",
            friends: "friends",
        },
    },
};

export default function App() {
    return (
        <NavigationContainer style={styles.container} linking={linking}>
            <Stack.Navigator screenOptions={globalScreenOptions}>
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="signUp" component={RegisterScreen} />
                <Stack.Screen name="home" component={HomeScreen} />
                <Stack.Screen name="newChat" component={AddChatScreen} />
                <Stack.Screen name="chat" component={ChatScreen} />
                <Stack.Screen name="settings" component={SettingsScreen} />
                <Stack.Screen
                    name="verifyEmail"
                    component={EmailVerifyScreen}
                />
                <Stack.Screen name="friends" component={FriendsScreen} />
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
});
