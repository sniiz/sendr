import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import {
    collection,
    getFirestore,
    onSnapshot,
    query,
    getAuth,
    orderBy,
} from "../firebase";
import { Avatar } from "react-native-elements";

const GroupSettingsScreen = ({ navigation, route }) => {
    useEffect(() => {
        const unsubscribe =
            onSnapshot(
                // uhhhhhhhh work on this a bunch
            );
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "gray",
                }}
            >
                WORK IN PROGRESS DAMNIT
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
});
