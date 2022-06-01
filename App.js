import { StyleSheet, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import EmailVerifyScreen from "./screens/EmailVerifyScreen";
import SettingsScreen from "./screens/SettingsScreen";
import UIText from "./components/LocalizedText";
import FriendsScreen from "./screens/FriendsScreen";
import * as Linking from "expo-linking";
import { getFirestore, setDoc, updateDoc, doc, getAuth } from "./firebase";

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
  headerStyle: {
    backgroundColor: "#0a0a0a",
    borderBottomWidth: 2,
    borderBottomColor: "#F2F7F2",
  },
  headerTitleStyle: { color: "#F2F7F2", fontWeight: "900" },
  headerTintColor: "#F2F7F2",
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
  // useEffect(() => {
  //   AppState.addEventListener("change", handleAppStateChange);
  //   return () => {
  //     AppState.removeEventListener("change", handleAppStateChange);
  //   };
  // }, []);
  // const handleAppStateChange = (nextAppState) => {
  //   console.log(nextAppState);
  //   if (nextAppState === "active") {
  //     while (!getAuth().currentUser) {
  //       // do nothing
  //       // relax for a bit maybe
  //     }
  //     updateDoc(doc(getFirestore(), "users", getAuth().currentUser.uid), {
  //       online: true,
  //     });
  //   }
  //   if (nextAppState === "background" && getAuth().currentUser) {
  //     updateDoc(doc(getFirestore(), "users", getAuth().currentUser.uid), {
  //       online: false,
  //     });
  //   }
  // };
  return (
    <NavigationContainer style={styles.container} linking={linking}>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signUp" component={RegisterScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="newChat" component={AddChatScreen} />
        <Stack.Screen name="chat" component={ChatScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen name="verifyEmail" component={EmailVerifyScreen} />
        <Stack.Screen name="friends" component={FriendsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
});
