import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  limit,
  getAuth,
  orderBy,
} from "../firebase";
import { UIText } from "../components/LocalizedText";

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `privateChats/${id}`, "messages"),
        orderBy("timestamp", "desc"),
        limit(1)
      ),
      (snapshot) => {
        setChatMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <ListItem
      onPress={() => enterChat(id, chatName)}
      key={id}
      bottomDivider
      style={{
        backgroundColor:
          chatMessages[0]?.uid === getAuth().currentUser.uid
            ? "white"
            : "black",
      }}
    >
      <Avatar
        rounded
        source={{
          uri: chatMessages?.[0]?.photoURL || "https://i.imgur.com/dA9mtkT.png",
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
          {loading ? (
            <ActivityIndicator size={10} color="gray" />
          ) : chatMessages[0]?.displayName && chatMessages[0]?.message ? (
            `${chatMessages[0]?.displayName}: ${chatMessages[0]?.message}`
          ) : (
            "it's very empty here"
          )}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({
  listItem: {
    // marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "gray",
  },
});
