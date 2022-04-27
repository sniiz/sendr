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
    // Input,
    ScrollView,
    Switch,
    Platform,
    Linking,
} from "react-native";
import { Avatar, Input } from "react-native-elements";
// import ImageCropPicker from "react-native-image-crop-picker";
import UIText from "../components/LocalizedText";
import {
    getAuth,
    signOut,
    deleteUser,
    onAuthStateChanged,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateProfile,
    updatePassword,
} from "../firebase";
import Spinner from "react-native-loading-spinner-overlay";
import { SimpleLineIcons } from "@expo/vector-icons";
const asyncSleep = (sec) =>
    new Promise((resolve) => setTimeout(resolve, sec * 1000));

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

const version = require("../assets/version-info.json");

export default function SettingsScreen({ navigation }) {
    const [logOutCount, setLogOutCount] = useState(0);
    const [deleteCount, setDeleteCount] = useState(0);

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: "black" },

            headerTintColor: "white",
            headerTitleAlign: "center",
        });
    }, [navigation]);

    const auth = getAuth();
    const user = auth.currentUser;

    if (true) {
        return (
            <ScrollView
                contentContainerStyle={styles.container}
                style={{ backgroundColor: "black", paddingVertical: 30 }}
            >
                <>
                    <Spinner
                        visible={isLoading}
                        textContent={null}
                        textStyle={{
                            color: "white",
                            textAlign: "center",
                            margin: 10,
                        }}
                    />
                    <View
                        style={{
                            width: "100%",
                            height: "10%",
                        }}
                    />
                    <Text style={[styles.settingText, { marginLeft: 0 }]}>
                        {UIText["settingsScreen"]["pfp"]}
                    </Text>
                    <Avatar
                        rounded
                        size="large"
                        source={{
                            uri: "https://i.imgur.com/dA9mtkT.png",
                        }}
                        containerStyle={{
                            marginBottom: 20,
                        }}
                        onPress={() => {
                            alert(UIText["settingsScreen"]["incomplete"]);
                        }}
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.settingText}>
                            {UIText["settingsScreen"]["username"]}
                        </Text>
                        <Input
                            style={styles.input}
                            placeholder={user?.displayName}
                            placeholderTextColor="gray"
                            onChangeText={(text) => {
                                setUsername(text);
                            }}
                            value={
                                username !== null ? username : user?.displayName
                            }
                        />
                        {username?.length >= 3 && username.length < 15 ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (username !== user?.displayName) {
                                        setIsLoading(true);
                                        updateProfile(user, {
                                            displayName: username,
                                        }).then(() => {
                                            setUsername(null);
                                            setIsLoading(false);
                                        });
                                    }
                                }}
                                style={{
                                    borderRadius: 100,
                                    borderWidth: 1,
                                    borderColor: "white",
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
                                {username}{" "}
                                {UIText["settingsScreen"]["usernameTooLong"]}
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
                            placeholderTextColor="gray"
                        />
                        {password?.length >= 6 ? (
                            <Input
                                style={styles.input}
                                placeholder={
                                    UIText["settingsScreen"]["oldPassword"]
                                }
                                secureTextEntry
                                onChangeText={(text) => {
                                    setOldPassword(text);
                                }}
                                placeholderTextColor="gray"
                                value={oldPassword}
                            />
                        ) : null}
                        {oldPassword?.length > 0 && password?.length > 0 ? (
                            <TouchableOpacity
                                onPress={() => {
                                    setIsLoading(true);
                                    var credential =
                                        EmailAuthProvider.credential(
                                            user.email,
                                            oldPassword
                                        );

                                    reauthenticateWithCredential(
                                        user,
                                        credential
                                    )
                                        .then(() => {
                                            updatePassword(user, password).then(
                                                () => {
                                                    setIsLoading(false);
                                                    setPassword("");
                                                    setOldPassword("");
                                                }
                                            );
                                        })
                                        .catch(() => {
                                            setIsLoading(false);
                                            alert(
                                                UIText["settingsScreen"][
                                                    "wrongPassword"
                                                ]
                                            );
                                        });
                                }}
                                style={{
                                    borderRadius: 100,
                                    borderWidth: 1,
                                    borderColor: "white",
                                    padding: 8,
                                    paddingHorizontal: 20,
                                    marginLeft: 10,
                                    marginBottom: 10,
                                }}
                            >
                                <Text style={[styles.settingHeader]}>
                                    {UIText["settingsScreen"]["changePassword"]}{" "}
                                    🔐
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
                            setLogOutCount(logOutCount + 1);
                            setDeleteCount(0);
                            if (logOutCount === 1) {
                                signOut(getAuth())
                                    .then(() => {
                                        navigation.navigate(
                                            UIText["loginScreen"]["barTitle"]
                                        );
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
                            borderRadius: 100,
                            borderWidth: 1,
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
                                deleteUser(user)
                                    .then(() => {
                                        navigation.navigate(
                                            UIText["loginScreen"]["barTitle"]
                                        );
                                        setDeleteCount(0);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                            asyncSleep(7).then(() => {
                                setDeleteCount(0);
                            });
                        }}
                        style={{
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: "red",
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
                    <View
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
                                color: "gray",
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
                                color="gray"
                            />
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            height: "5%",
                            width: "100%",
                        }}
                    ></View>
                    <Text style={styles.version}>
                        {version.number}
                        {"\n"}✨ {version.name} ✨
                    </Text>
                </>
            </ScrollView>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.dangerButton}>¯\_(ツ)_/¯</Text>
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
        justifyContent: "flex-start",
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
    dangerButton: {
        color: "#ff3333",
        fontSize: 20,
        // fontWeight: "bold",
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
        color: "white",
        borderWidth: 1,
        borderColor: "white",
        width: "100%",
        padding: 10,
        marginTop: 0,
        textAlign: "left",
    },
    version: {
        color: "gray",
        fontSize: 10,
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: 20,
        fontFamily: Platform.OS === "ios" ? "Arial" : "monospace",
    },
    settingText: {
        color: "gray",
        fontSize: 17,
        textAlign: "center",
        marginBottom: 10,
        marginLeft: 10,
        // marginHorizontal: 50,
        // marginVertical: 10,
    },
});
