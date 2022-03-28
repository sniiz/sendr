import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    TouchableOpacity,
    Image,
} from "react-native";
import UIText from "../components/LocalizedText";
import { Avatar } from "react-native-elements";
import React from "react";
import { getAuth, signOut } from "../firebase";

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>¯\_(ツ)_/¯</Text>
            <Text style={styles.settingText}>
                {UIText["profileScreen"]["wipText"]}
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    settingText: {
        color: "gray",
        fontSize: 15,
    },
});
