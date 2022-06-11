import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import ActivityIndicator from "./ActivityIndicator";
import { ListItem, Avatar } from "react-native-elements";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  limit,
  getAuth,
  getDoc,
  doc,
  orderBy,
} from "../firebase";
import { UIText } from "../components/LocalizedText";

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dm, setDm] = useState(false);
  const [otherUser, setOtherUser] = useState({});

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
        getDoc(doc(db, `privateChats/${id}`)).then((chat) => {
          setDm(chat.data().dm);

          if (chat.data().dm) {
            const otherUserId = chat
              .data()
              .members.filter((user) => user !== getAuth().currentUser.uid)[0];

            getDoc(doc(db, `users/${otherUserId}`)).then((user) => {
              setOtherUser(user.data());
              console.log(user.data());
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        });
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <ListItem
      onPress={() => enterChat(id, chatName ? chatName : otherUser.name)}
      key={id}
      bottomDivider
      containerStyle={{
        backgroundColor:
          chatMessages[0]?.uid === getAuth().currentUser.uid
            ? "#F2F7F2"
            : "#0a0a0a",
      }}
    >
      <Avatar
        rounded
        source={{
          uri:
            (dm ? otherUser?.pfp : chatMessages?.[0]?.photoURL) ||
            "https://i.imgur.com/dA9mtkT.png",
        }}
      />
      <ListItem.Content>
        {/* <ListItem.Title style={{ fontFamily: "bold" }}>
         */}
        <ListItem.Title
          style={{
            fontWeight: "800",
            color:
              chatMessages[0]?.uid === getAuth().currentUser.uid
                ? "#0a0a0a"
                : "#f2f7f2",
          }}
        >
          {dm ? otherUser.name : chatName}
        </ListItem.Title>
        <ListItem.Subtitle
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: "#727178" }}
        >
          {loading ? (
            <ActivityIndicator size={10} color="#727178" />
          ) : chatMessages[0]?.displayName && chatMessages[0]?.message ? (
            `${
              chatMessages[0]?.displayName === getAuth().currentUser.displayName
                ? "you"
                : chatMessages[0]?.displayName
            }: ${chatMessages[0]?.message}`
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
    borderTopWidth: 2,
    borderTopColor: "#727178",
  },
});
