import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { useEffect } from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import EmailVerifyScreen from "./screens/EmailVerifyScreen";
import SettingsScreen from "./screens/SettingsScreen";
// import UIText from "./components/LocalizedText";
import FriendsScreen from "./screens/FriendsScreen";
import UserInfoScreen from "./screens/UserInfoScreen";
import * as Linking from "expo-linking";
import { useState } from "react";
import Theme from "./components/themes";
// import { getFirestore, setDoc, updateDoc, doc, getAuth } from "./firebase";

const Stack = createNativeStackNavigator();
const theme = Theme.get("classic"); // too lazy to remove the themes so i guess theyll stay
// console.log(theme);
const globalScreenOptions = {
  headerStyle: {
    backgroundColor: theme?.main,
    borderBottomWidth: 2,
    borderBottomColor: theme?.accent,
  },
  headerTitleStyle: { color: theme?.accent, fontWeight: "900" },
  headerTintColor: theme?.accent,
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
      userInfo: "user-info",
    },
  },
};

export default function App() {
  const [declined, setDeclined] = useState(false);
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

  // var scale = useWindowDimensions().fontScale;
  var dims = useWindowDimensions();
  if ((dims.height < 350 || dims.width < 400) && !declined) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            color: "#727178",
            textAlign: "center",
          }}
        >
          your device/window may be too small to properly use sendr.
        </Text>
        <TouchableOpacity
          onPress={() => {
            setDeclined(true);
          }}
        >
          <Text
            style={{
              fontSize: 25,
              color: "#f2f1f8",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            press to proceed anyway
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
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
          <Stack.Screen name="userInfo" component={UserInfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0b",
    alignItems: "center",
    justifyContent: "center",
  },
});
