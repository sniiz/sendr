import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import UIText from "../components/LocalizedText";
import { Avatar } from "react-native-elements";
import React from "react";
import { getAuth, signOut } from "../firebase";

export default function ProfileScreen() {
    const [nerdData, setNerdData] = React.useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View
                    style={{
                        marginTop: 300,
                    }}
                />
                <Text style={styles.title}>¯\_(ツ)_/¯</Text>
                <Text style={styles.settingText}>
                    {UIText["profileScreen"]["wipText"]}
                </Text>
                <View
                    style={{
                        marginTop: 1000,
                    }}
                />
                <Text style={styles.settingText}>
                    profile info for nerds{"\n\n\n"}
                    {JSON.stringify(getAuth().currentUser)}
                </Text>
            </ScrollView>
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
