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

const CustomListItem = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, `privateChats/${id}`, "messages"),
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

    // if (!loaded) {
    //     return null;
    // }
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
                {/* <ListItem.Title style={{ fontFamily: "bold" }}>
                 */}
                <ListItem.Title
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ color: "gray" }}
                >
                    {chatMessages[0]?.displayName
                        ? chatMessages[0]?.displayName
                        : "no one"}
                    :{" "}
                    {chatMessages[0]?.message
                        ? chatMessages[0]?.message
                        : "* empty *"}
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
