import React, {
  useLayoutEffect,
  useState,
  componentDidMount,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  // Input,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
  Platform,
  Linking,
  SafeAreaView,
} from "react-native";
import { useKeyboard } from "@react-native-community/hooks";
import { Avatar, Input } from "react-native-elements";
// import ImageCropPicker from "react-native-image-crop-picker";
import UIText from "../components/LocalizedText";
import {
  getAuth,
  signOut,
  deleteUser,
  onAuthStateChanged,
  getFirestore,
  EmailAuthProvider,
  reauthenticateWithCredential,
  getDocs,
  updateDoc,
  getDoc,
  setDoc,
  doc,
  collection,
  query,
  where,
  deleteDoc,
  updateProfile,
  updatePassword,
  onSnapshot,
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "../firebase";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
import { SimpleLineIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import { Popable } from "react-native-popable";
// import Clipboard from "@react-native-clipboard/clipboard";
import * as Clipboard from "expo-clipboard";

const version = require("../assets/version-info.json");

function SettingsScreen({ navigation }) {
  const [logOutCount, setLogOutCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);

  // const [pronounPickerOpen, setPronounPickerOpen] = useState(false);
  // const [pronoun, setPronoun] = useState(null);
  // const [items, setItems] = useState([
  //     {
  //         label: "he/him",
  //         value: "he/him",
  //     },
  //     {
  //         label: "she/her",
  //         value: "she/her",
  //     },
  //     {
  //         label: "they/them",
  //         value: "they/them",
  //     },
  //     {
  //         label: "xe/xem",
  //         value: "xe/xem",
  //     },
  //     {
  //         label: "e/em",
  //         value: "e/em",
  //     },
  //     {
  //         label: "ze/hir",
  //         value: "ze/hir",
  //     },
  //     {
  //         label: "fae/faer",
  //         value: "fae/faer",
  //     },
  //     {
  //         label: "ey/em",
  //         value: "ey/em",
  //     },
  //     {
  //         label: "any pronouns",
  //         value: "any pronouns",
  //     },
  //     {
  //         label: "ask for pronouns",
  //         value: "ask for pronouns",
  //     },
  // ]);

  // WIP

  const [pfp, setPfp] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const kb = useKeyboard();
  const auth = getAuth();
  const user = auth.currentUser;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#0a0a0a" },
      headerTintColor: "#F2F7F2",
      headerTitleAlign: "center",
      title: UIText["settingsScreen"]["barTitle"],
    });
  }, [navigation]);

  useEffect(() => {
    if (!auth?.currentUser?.uid) {
      navigation.replace("login");
      return;
    }
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUsername(null);
      } else {
        setUsername("undefined");
      }
    });
    const unsubPfp = onSnapshot(
      doc(getFirestore(), "users", user.uid),
      (doc) => {
        if (doc.exists()) {
          setPfp(doc.data().pfp || "https://i.imgur.com/dA9mtkT.png");
          setUsername(doc.data().username);
        }
      }
    );
    DropDownPicker.setListMode("SCROLLVIEW");
    DropDownPicker.setTheme("DARK");
    return () => {
      unsub();
      unsubPfp();
    };
  }, []);
  const asyncSleep = (sec) =>
    new Promise((resolve) => setTimeout(resolve, sec * 1000));
  const applyNickname = (db, uid, nickname) => {
    nickname = nickname.trim();

    return new Promise((resolve, reject) => {
      getDocs(
        query(collection(db, "users"), where("name", "==", nickname))
      ).then((users) => {
        // console.log(users);
        if (users.docs.length > 0) {
          alert(UIText["signUpScreen"]["taken"]);
          reject("nickname taken");
        } else {
          updateProfile(getAuth().currentUser, {
            displayName: nickname,
          });
          updateDoc(doc(collection(db, "users"), uid), {
            name: nickname,
          })
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
          getDocs(
            query(
              collection(db, "privateChats"),
              where("members", "array-contains", uid)
            )
          ).then((chats) => {
            chats.forEach((chat) => {
              getDocs(
                query(
                  collection(db, "privateChats", chat.id, "messages"),
                  where("uid", "==", uid)
                )
              ).then((messages) => {
                messages.forEach((message) => {
                  updateDoc(
                    doc(
                      collection(db, "privateChats", chat.id, "messages"),
                      message.id
                    ),
                    {
                      displayName: nickname,
                    }
                  );
                });
              });
            });
          });
        }
      });
    });
  };

  const uploadImage = async (uri) => {
    // THANK U https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), getAuth().currentUser.uid);
    const result = await uploadBytes(fileRef, blob);

    return await getDownloadURL(fileRef);
  };

  const handlePfp = () => {
    if (Platform.OS !== "web") {
      ImagePicker.requestMediaLibraryPermissionsAsync().then(() => {
        if (status !== "granted") {
          alert(UIText["signUpScreen"]["libraryPermsError"]);
          return;
        }
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.4,
          allowsMultipleSelection: false,
        }).then((result) => {
          if (!result.cancelled) {
            uploadImage(result.uri).then((url) => {
              setPfp(url);
              updateDoc(doc(collection(getFirestore(), "users"), user.uid), {
                pfp: url,
              });
              updateProfile(getAuth().currentUser, {
                photoURL: url,
              });
            });
          }
        });
      });
    } else {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0,
        allowsMultipleSelection: false,
      }).then((result) => {
        if (!result.cancelled) {
          uploadImage(result.uri).then((url) => {
            setPfp(url);
            updateDoc(doc(collection(getFirestore(), "users"), user.uid), {
              pfp: url,
            });
            updateProfile(getAuth().currentUser, {
              photoURL: url,
            });
          });
        }
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a0a0a",
        // paddingBottom: kb.keyboardHeight * 10,
      }}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={{
          backgroundColor: "#0a0a0a",
          // paddingVertical: 30,
          flex: 1,
          width: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "10%",
          }}
        />
        <Text style={[styles.settingText, { marginLeft: 0, marginBottom: 10 }]}>
          {UIText["settingsScreen"]["pfp"]}
        </Text>
        <Popable
          content={
            <View style={styles.popupContainer}>
              <Text style={styles.popupText}>
                {UIText["settingsScreen"]["pfpChange"]}
              </Text>
            </View>
          }
          action="hover"
          style={{ opacity: 0.8 }}
          position="bottom"
        >
          <TouchableOpacity
            onPress={handlePfp}
            style={{
              marginBottom: 10,
            }}
          >
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 1000000,
              }}
              resizeMode={"cover"}
              source={{
                uri: pfp || "https://i.imgur.com/dA9mtkT.png",
              }}
            />
          </TouchableOpacity>
        </Popable>
        {/* <DropDownPicker
                    open={pronounPickerOpen}
                    value={pronoun}
                    placeholder="select your pronouns"
                    placeholderStyle={{
                        color: "#F2F7F2",
                    }}
                    items={items}
                    setOpen={setPronounPickerOpen}
                    setValue={setPronoun}
                    setItems={setItems}
                    containerStyle={{
                        width: "fit-content",
                        padding: 10,
                        color: "#F2F7F2",
                        borderColor: "#F2F7F2",
                        borderWidth: 2,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    labelStyle={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#F2F7F2",
                    }}
                    listItemContainer={{
                        backgroundColor: "#0a0a0a",
                    }}
                /> WIP*/}
        <View style={styles.inputContainer}>
          <Text style={styles.settingText}>
            {UIText["settingsScreen"]["username"]}
          </Text>
          <Input
            style={styles.input}
            placeholder={user?.displayName}
            placeholderTextColor="#727178"
            onChangeText={(text) => {
              setUsername(text);
            }}
            value={username !== null ? username : user?.displayName}
            onSubmitEditing={() => {
              if (username >= 3 && username < 15) {
                setIsLoading(true);
                applyNickname(getFirestore(), user.uid, username).then(() => {
                  setIsLoading(false);
                  setUsername(null);
                });
              }
            }}
          />
          {username?.length >= 3 && username.length < 15 ? (
            <TouchableOpacity
              onPress={() => {
                if (username !== user?.displayName && username !== "potat") {
                  setIsLoading(true);
                  applyNickname(getFirestore(), user.uid, username).finally(
                    () => {
                      setIsLoading(false);
                      setUsername(null);
                    }
                  );
                }
              }}
              style={{
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "#F2F7F2",
                padding: 8,
                paddingHorizontal: 20,
                marginLeft: 10,
                marginBottom: 10,
              }}
            >
              <Text style={styles.settingHeader}>
                {username === user.displayName
                  ? `${UIText["settingsScreen"]["alreadyNamed"]} ${username}!`
                  : `${UIText["settingsScreen"]["changeUsername"]} ${username} 🤙`}
              </Text>
            </TouchableOpacity>
          ) : username?.length >= 15 ? (
            <Text style={styles.settingHeader}>
              {username} {UIText["settingsScreen"]["usernameTooLong"]}
            </Text>
          ) : null}
          <Text style={styles.settingText}>
            {UIText["settingsScreen"]["password"]}
          </Text>
          <Input
            style={styles.input}
            placeholder={"**********"}
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text);
            }}
            value={password}
            placeholderTextColor="#727178"
          />
          {password?.length >= 6 ? (
            <Input
              style={styles.input}
              placeholder={UIText["settingsScreen"]["oldPassword"]}
              secureTextEntry
              onChangeText={(text) => {
                setOldPassword(text);
              }}
              placeholderTextColor="#727178"
              value={oldPassword}
            />
          ) : null}
          {oldPassword?.length > 0 && password?.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                setIsLoading(true);
                var credential = EmailAuthProvider.credential(
                  user.email,
                  oldPassword
                );

                reauthenticateWithCredential(user, credential)
                  .then(() => {
                    updatePassword(user, password).then(() => {
                      setIsLoading(false);
                      setPassword("");
                      setOldPassword("");
                    });
                  })
                  .catch(() => {
                    setIsLoading(false);
                    alert(UIText["settingsScreen"]["wrongPassword"]);
                  });
              }}
              style={{
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "#F2F7F2",
                padding: 8,
                paddingHorizontal: 20,
                marginLeft: 10,
                marginBottom: 10,
              }}
            >
              <Text style={[styles.settingHeader]}>
                {UIText["settingsScreen"]["changePassword"]} 🔐
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            height: "5%",
            width: "100%",
          }}
        ></View>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setStringAsync(auth.currentUser.uid);
          }}
          style={{
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "#F2F7F2",
            padding: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={[
              styles.dangerButton,
              {
                color: "#F2F7F2",
              },
              6,
            ]}
          >
            {UIText["settingsScreen"]["copyUid"]} 📁
          </Text>
        </TouchableOpacity>
        <View style={{ height: 20, width: "100%" }}></View>

        <TouchableOpacity
          onPress={() => {
            setLogOutCount(logOutCount + 1);
            setDeleteCount(0);
            if (logOutCount === 1) {
              signOut(getAuth())
                .then(() => {
                  navigation.replace("login");
                  setLogOutCount(0);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            asyncSleep(7).then(() => {
              setLogOutCount(0);
            });
          }}
          style={{
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "red",
            padding: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.dangerButton}>
            {UIText["settingsScreen"]["logOutButton"]}
          </Text>
        </TouchableOpacity>
        {logOutCount === 1 ? (
          <Text style={styles.settingText}>
            {UIText["settingsScreen"]["logOutConfirm"]}
          </Text>
        ) : null}

        <View style={{ height: 20, width: "100%" }}></View>

        <TouchableOpacity
          onPress={() => {
            setDeleteCount(deleteCount + 1);
            setLogOutCount(0);
            if (deleteCount === 1) {
              deleteDoc(
                doc(getFirestore(), `users/${auth.currentUser.uid}`)
              ).then(() => {
                deleteUser(user)
                  .then(() => {
                    navigation.replace("login");
                    setDeleteCount(0);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
            }
            asyncSleep(7).then(() => {
              setDeleteCount(0);
            });
          }}
          style={{
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "#ff5555",
            padding: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.dangerButton}>
            {UIText["settingsScreen"]["deleteAccountButton"]}
          </Text>
        </TouchableOpacity>
        {deleteCount === 1 ? (
          <Text style={styles.settingText}>
            {UIText["settingsScreen"]["deleteAccountConfirm"]}
          </Text>
        ) : null}
        {/* <View
                        style={{
                            height: "5%",
                            width: "100%",
                        }}
                    ></View>
                    <TouchableOpacity
                        onPress={() => {
                            if (Platform.OS === "web") {
                                window.open(
                                    "https://github.com/sniiz/sendr/issues",
                                    "_blank"
                                );
                            } else {
                                Linking.openURL(
                                    "https://github.com/sniiz/sendr/issues"
                                );
                            }
                        }}
                    >
                        <Text
                            style={{
                                color: "#727178",
                                fontSize: 10,
                                fontFamily:
                                    Platform.OS === "ios"
                                        ? "Courier"
                                        : "monospace",
                                marginHorizontal: 30,
                                textAlign: "center",
                            }}
                        >
                            having trouble with sendr? have a suggestion to make
                            the app better? open an issue on github!!{" "}
                            <SimpleLineIcons
                                name="share-alt"
                                size={10}
                                color="#727178"
                            />
                        </Text>
                    </TouchableOpacity> */}
        <View
          style={{
            height: "5%",
            width: "100%",
          }}
        ></View>
        <Text style={styles.version}>
          info:{"\n"} app version: {version.number} · ✨ {version.name} ✨
          {"\n\n"}email: {auth?.currentUser?.email}
          {"\n"}verified: {auth?.currentUser?.emailVerified?.toString()}
          {"\n\n"}
          user id: {auth?.currentUser?.uid}
        </Text>
        <View
          style={{
            height: "5%",
            width: "100%",
          }}
        ></View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  settingContainer: {
    width: "100%",
    height: "20%",
    borderBottomWidth: 2,
    borderBottomColor: "#727178",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  settingHeader: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  dangerButton: {
    color: "#ff5555",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    overflow: "visible",
  },
  inputContainer: {
    width: "70%",
    maxWidth: 500,
    alignItems: "flex-start",
    marginVertical: 10,
  },
  input: {
    color: "#F2F7F2",
    borderWidth: 2,
    borderColor: "#F2F7F2",
    width: "100%",
    padding: 10,
    marginTop: 0,
    textAlign: "left",
    fontWeight: "bold",
  },
  version: {
    color: "#727178",
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    // marginBottom: -10,
    fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
  },
  settingText: {
    color: "#727178",
    fontSize: 17,
    textAlign: "center",
    marginLeft: 10,
    // marginHorizontal: 50,
    // marginVertical: 10,
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
    paddingVertical: "10%",
  },
  popupText: {
    color: "#F2F7F2",
    fontSize: 12,
    fontWeight: "bold",
  },
});
