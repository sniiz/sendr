import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import {
    collection,
    getFirestore,
    onSnapshot,
    query,
    getAuth,
    orderBy,
} from "../firebase";
import { useFonts } from "expo-font";

const CustomListItem = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([]);

    const [loaded] = useFonts({
        bold: require("../assets/fonts/OktaNeue-Black.ttf"),
    });

    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, `chats/${id}`, "messages"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => {
                setChatMessages(
                    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
            }
        );
        return () => unsubscribe();
    }, []);

    return (
        <ListItem
            onPress={() => enterChat(id, chatName)}
            key={id}
            bottomDivider
            style={styles.listItem}
        >
            <Avatar
                rounded
                source={{
                    uri:
                        chatMessages?.[0]?.photoURL ||
                        "https://i.imgur.com/dA9mtkT.png",
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontFamily: "bold" }}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {chatMessages != null
                        ? chatMessages?.[0]?.displayName
                        : "nobody"}
                    :{" "}
                    {chatMessages != null
                        ? chatMessages?.[0]?.message
                        : "nothing"}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
};

export default CustomListItem;

const styles = StyleSheet.create({
    listItem: {
        // marginVertical: 10,
        color: "black",
        borderTopWidth: 1,
        borderTopColor: "gray",
    },
});
