import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

const SecretSettingsScreen = ({ navigation }) => {
  useEffect(() => {
    alert("oo secretos");
    navigation.navigate("home");
  }, []);
  return <View style={styles.container}></View>;
};

export default React.memo(SecretSettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0b",
    alignItems: "center",
    justifyContent: "center",
  },
});
