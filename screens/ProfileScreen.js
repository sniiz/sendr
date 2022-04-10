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
// import ImagePicker from "react-native-image-picker";
// import * as ImagePicker from "react-native-image-picker";
// TODO PFP IMAGE PICKER FOR HECKS SAKE
import React from "react";
import { getAuth, signOut } from "../firebase";
import { TouchableWithoutFeedback } from "react-native";
import ColorScheme from "../components/ColorScheme";

export default function ProfileScreen() {
    const [nerdData, setNerdData] = React.useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {true ? (
                    <>
                        <View
                            style={{
                                marginTop: 300,
                            }}
                        />
                        <Text style={styles.title}>¯\_(ツ)_/¯</Text>
                        <Text style={styles.settingText}>
                            {UIText["profileScreen"]["wipText"]}
                        </Text>
                    </>
                ) : (
                    <>
                        <View
                            style={{
                                width: "100%",
                                height: 200,
                            }}
                        ></View>

                        <TouchableWithoutFeedback
                            onPress={() => {
                                ImagePicker.launchImageLibrary(
                                    {
                                        width: 512,
                                        height: 512,
                                        includeBase64: true,
                                        cropping: true,
                                    },
                                    (response) => {
                                        console.log(
                                            `wow lookie what a cool image: ${JSON.stringify(
                                                response
                                            )}`
                                        );
                                    }
                                );
                            }}
                        >
                            <Avatar
                                rounded
                                size="xlarge"
                                source={{
                                    uri: "https://i.imgur.com/dA9mtkT.png",
                                }}
                                // showAccessory
                                // onAccessoryPress={() => {
                                //     console.log("accessory pressed");
                                // }}
                                // onPress={() => {
                                //     console.log("avatar pressed");
                                // }}
                                // activeOpacity={0.7}
                            />
                        </TouchableWithoutFeedback>
                    </>
                )}
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
