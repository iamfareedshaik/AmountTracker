import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { Card } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../../context/DataContext";
import Toast from "react-native-toast-message";
import { http } from "../../../Api";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ExpenseSplitPage = ({ navigation, route }) => {
  const amt = route.params?.amount ? route.params?.amount : "";
  const desc = route.params?.description ? route.params?.description : "";
  const [totalAmount, setTotalAmount] = useState(amt);
  const [description, setDescription] = useState(desc);
  const { sharedData, SplitType } = useData();
  const [selectedPerson, setSelectedPerson] = useState(sharedData[0]);

  const shareExpense = async () => {
    try {
      // Validation checks
      if (!totalAmount || parseFloat(totalAmount) <= 0) {
        Alert.alert("Invalid Amount", "Amount should be greater than zero.");
        return;
      }

      if (!description.trim()) {
        Alert.alert("Invalid Description", "Please provide a description.");
        return;
      }

      if (sharedData.length < 2) {
        Alert.alert(
          "Insufficient Participants",
          "Please select at least one participant."
        );
        return;
      }

      const personShare = sharedData.map(() => totalAmount / sharedData.length);
      const updateExpense = sharedData.map((person, index) => {
        return {
          name: person.name,
          phone: person.phone,
          share: personShare[index],
          groupid: person.groupid,
        };
      });
      const response = await http.post("/expense/create", {
        amount: totalAmount,
        description: description,
        payee: selectedPerson,
        participants: SplitType === "Equally" ? updateExpense : sharedData,
        SplitType: SplitType,
      });
      const data = response.data;
      navigation.goBack();
    } catch (error) {
      console.error("Error making service call:", error);
    }
  };

  const renderSharingWith = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>
        Sharing with {sharedData ? sharedData.length : 0} people
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AddedPeople", { addedPeople: sharedData })
        }
      >
        <Text style={styles.sectionLink}>View or Add</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDropdown = () =>
    sharedData && sharedData.length > 0 ? (
      <View style={styles.rowContainer}>
        <View style={styles.columnContainer}>
          <Text style={styles.dropdownLabel}>Paid By:</Text>
        </View>
        <View style={styles.columnContainer}>
          <Picker
            selectedValue={selectedPerson}
            onValueChange={(itemValue) => setSelectedPerson(itemValue)}
          >
            {sharedData.map((person) => (
              <Picker.Item
                key={person.name}
                label={person.name}
                value={person}
              />
            ))}
          </Picker>
        </View>
      </View>
    ) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TouchableWithoutFeedback>
            <View style={styles.editableContainer}>
              <Text style={styles.dollarText}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder='Amount'
                keyboardType='numeric'
                onChangeText={setTotalAmount}
                value={totalAmount.toString()}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={styles.editableContainer}>
              <TextInput
                style={styles.descriptionInput}
                placeholder='Add a description'
                onChangeText={setDescription}
                value={description}
              />
            </View>
          </TouchableWithoutFeedback>
        </Card.Content>
      </Card>

      <Card style={styles.addPeopleCard}>
        <Card.Content>
          {renderSharingWith()}
          {renderDropdown()}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.splitTypeButtonContainer}
          onPress={() =>
            navigation.navigate("Split Type", {
              SplitType: SplitType,
              totalAmount: totalAmount,
            })
          }
        >
          <Text style={styles.splitTypeButtonText}>
            {`Split ${SplitType}`}{" "}
            <AntDesign name='right' size={18} color='white' />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButtonContainer}
          onPress={shareExpense}
        >
          <Text style={styles.shareButtonText}>
            Share Expense <AntDesign name='sharealt' size={18} color='white' />
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
  },
  card: {
    marginBottom: 12,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    width: "100%",
    maxWidth: 500, // Limiting maximum width to 500 (adjust as needed)
    alignSelf: "center", // Centering the card horizontally
  },
  editableContainer: {
    flexDirection: "row",
    alignItems: "center", // Centering vertically
    justifyContent: "center",
  },
  dollarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3498db",
  },
  amountInput: {
    height: 40,
    fontSize: 28,
    marginBottom: 6,
    color: "#333",
    marginLeft: 10,
    marginRight: 10,
    width: "70%", // Adjust percentage width as needed
  },
  descriptionInput: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
    marginLeft: 10,
    width: "70%", // Adjust percentage width as needed
  },
  addPeopleCard: {
    marginBottom: 15,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 500, // Limiting maximum width to 500 (adjust as needed)
    alignSelf: "center", // Centering the card horizontally
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 16,
    color: "#333",
  },
  sectionLink: {
    fontSize: 16,
    color: "#3498db",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  columnContainer: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 500, // Limiting maximum width to 500 (adjust as needed)
    alignSelf: "center", // Centering the button container horizontally
  },
  splitTypeButtonContainer: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
    borderWidth: 2,
    borderColor: "#27ae60",
  },
  splitTypeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  shareButtonContainer: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
  },
  shareButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ExpenseSplitPage;
