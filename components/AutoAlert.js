import { Alert, Platform } from "react-native";
import message from "@tauri-apps/api/dialog";
import { getAdditionalUserInfo } from "firebase/auth";

const autoAlert = (msg, title = null) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
        Alert.alert(title ? title : "", msg);
    } else if (Platform.OS !== "web") {
        message(msg);
    } else {
        alert(msg);
    }
};

export default autoAlert;

// dang i wonder why every lil utility i write goes unused
