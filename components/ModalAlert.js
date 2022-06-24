import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";

// i literally threw this together with copilot in like 10 minutes so i have no idea whether it works or not
// (tbh probably doesn't)

export default React.memo(function ModalAlert({
  visible,
  setVisible,
  title,
  message,
  buttonText,
  buttonAction,
}) {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>{message}</Text>
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                buttonAction();
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#F2F7F2",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    maxWidth: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeader: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0a0a0a",
    textAlign: "center",
  },
  modalBody: {
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0a0a0a",
    textAlign: "center",
  },
  modalFooter: {
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "#0a0a0a",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F2F7F2",
  },
});
