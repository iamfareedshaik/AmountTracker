import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import http from "../Api";

const { height, width } = Dimensions.get("window");

const PersonTransactionHeader = ({ navigation, route }) => {
  const { payerId } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);

  const clearTransactions = async () => {
    try {
      const response = await http.put(`/expense/clear/${payerId}`);
      const data = response.data;
    } catch (error) {
      // console.error("Error fetching data:", error);
    }

    setModalVisible(false);
  };

  const handleShowHistory = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={{ marginRight: 16 }} onPress={handleShowHistory}>
        <Text>Settle All</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            All transactions will be settled.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={clearTransactions}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    height: 120, // Adjust the height as needed
    width: width - 40, // Adjust the width as needed
    marginTop: height / 3, // Adjust the marginTop as needed
    backgroundColor: "white",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3498db",
  },
  buttonText: {
    color: "#3498db",
    fontSize: 16,
  },
});

export default PersonTransactionHeader;
