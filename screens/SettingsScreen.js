import React, { useLayoutEffect, useState } from "react";
import { render } from "react-dom";
import {
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    View,
    SafeAreaView,
    TextInput,
    ScrollView,
    Switch,
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import UIText from "../components/LocalizedText";
import { Storage } from "expo-storage";

// const storage = new MMKVStorage().Loader().initialize();
// TODO: find a way to store things

class BinarySwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        };
    }

    componentDidMount() {
        this.setState({ value: this.props.value });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    render() {
        return (
            <View style={styles.settingContainer}>
                <Text style={styles.settingHeader}>{this.props.title}</Text>
                <Switch
                    trackColor={{ false: "#080808", true: "white" }}
                    thumbColor={this.state.value ? "black" : "white"}
                    ios_backgroundColor="#080808"
                    onValueChange={(value) => {
                        this.setState({ value });
                    }}
                    value={this.state.value}
                />
            </View>
        );
    }
}

export default function SettingsScreen() {
    // TODO: settings
    if (false) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <BinarySwitch title="test setting :D" />
                    <BinarySwitch title="another one :D" />
                    <BinarySwitch title="another one :D" />
                    <BinarySwitch title="another one :D" />
                    <BinarySwitch title="another one :D" />
                    <BinarySwitch title="another one :D" />
                    <BinarySwitch title="another one :D" />
                </ScrollView>
            </SafeAreaView>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>¯\_(ツ)_/¯</Text>
                <Text style={styles.settingText}>
                    {UIText["settingsScreen"]["wipText"]}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },

    settingContainer: {
        width: "100%",
        height: "20%",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        padding: 10,
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
    },
    settingHeader: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
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
