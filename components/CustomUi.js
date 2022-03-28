import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
    Platform,
} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import ThemedListItem from "react-native-elements/dist/list/ListItem";
import { SafeAreaView } from "react-native-safe-area-context";

export class CoolButton extends React.Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <Text
                    style={
                        this.props.style != null
                            ? this.props.style
                            : styles.login
                    }
                >
                    {this.props.text}
                </Text>
            </TouchableWithoutFeedback>
        );
    }
}

export class Header extends React.Component {
    render() {
        return (
            <Text
                style={
                    this.props.style != null ? this.props.style : styles.title
                }
            >
                {this.props.children}
            </Text>
        );
    }
}

export class Loading extends React.Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <AnimatedLottieView
                    source={require("../assets/loading.json")}
                    style={styles.ImageDimension}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    ImageDimension: {
        width: 200,
        height: 200,
    },
    inputContainer: {
        width: 350,
        marginVertical: 10,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        color: "white",
        backgroundColor: "black",
        fontWeight: "bold",
    },
    noacc: {
        color: "#f0f0f0",
        fontSize: 17,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "right",
        overflow: "visible",
    },
    login: {
        color: "white",
        fontSize: 25,
        marginBottom: 20,
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    title: {
        color: "white",
        fontSize: 40,
        width: "auto",
        fontWeight: "bold",
        textAlign: "center",
        overflow: "visible",
    },
    elbutton: {
        alignItems: "center",
    },
    version: {
        color: "gray",
        fontSize: 10,
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: 20,
        fontFamily: Platform.OS === "ios" ? "arial" : "monospace",
    },
    input: {
        color: "white",
        borderWidth: 2,
        borderColor: "white",
        padding: 10,
        marginTop: 20,
        textAlign: "left",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        paddingBottom: 20,
        backgroundColor: "black",
    },
});
