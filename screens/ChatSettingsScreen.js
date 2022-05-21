import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  getAuth,
  doc,
  where,
  getDoc,
  orderBy,
} from "../firebase";
import { Avatar } from "react-native-elements";

const ChatSettingsScreen = ({ navigation, route }) => {
  const [isDM, setIsDM] = useState(false);
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [icon, setIcon] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(getFirestore(), `privateChats/${route.params.id}`)).then(
      (chat) => {
        setIsDM(chat.data().dm);
        const members = [];
        chat.data().members.forEach((member) => {
          getDoc(doc(getFirestore(), `users/${member}`)).then((userInfo) => {
            members.push({
              id: member,
              name: userInfo.data().name,
              pfp: userInfo.data().pfp,
            });
            setMembers(members);
          });
        });
        setLoading(false);
      }
    );
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: isDM ? "dm settings" : "chat settings",
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={30} color="gray" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("chat", { id: route.params.id });
        }}
      >
        <Text>go to chat</Text>
      </TouchableOpacity>
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

export default ChatSettingsScreen;
