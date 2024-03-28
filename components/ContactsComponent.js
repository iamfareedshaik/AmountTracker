import React, { useState, useEffect, forwardRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Card } from "react-native-paper";
import * as Contacts from "expo-contacts";
import PersonChip from "../app/pages/ExpenseView/PersonChip";
import Toast from "react-native-toast-message";
import { useData } from "../app/context/DataContext";
import RNPickerSelect from "react-native-picker-select";
import { countryCodes } from "../countryCodes";
import { checkCode } from "../app/pages/helper";
const PersonChipMemo = PersonChip;

const ContactsComponent = forwardRef(({ addedPeople, navigation }, ref) => {
  const [searchText, setSearchText] = useState("");
  const [selectedPeople, setSelectedPeople] = useState(addedPeople);
  const [allPeople, setAllPeople] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [SelectedContact, setSelectedContact] = useState();
  const [errMessage, setErrmessage] = useState("");
  const { updateData } = useData();

  useEffect(() => {
    getContactsPermission();
  }, []);

  const handleConfirm = () => {
    const cleanedPhoneNumber = SelectedContact.phone.replace(/[^\d+]/g, "");
    let contact;
    if (!selectedCountryCode) {
      setErrmessage("Please select the country code");
      return;
    }
    if (contactNumber.startsWith("+")) {
      if (checkCode(selectedCountryCode, cleanedPhoneNumber)) {
        contact = { name: SelectedContact.name, phone: cleanedPhoneNumber };
        setIsModalVisible(false);
        setSelectedPeople((prevSelected) => [...prevSelected, contact]);
        updateData((prevData) => [...prevData, contact]);
      } else {
        setErrmessage("Please check the country code");
      }
    } else {
      contact = {
        name: SelectedContact.name,
        phone: selectedCountryCode + cleanedPhoneNumber,
      };
      setIsModalVisible(false);
      setSelectedPeople((prevSelected) => [...prevSelected, contact]);
      updateData((prevData) => [...prevData, contact]);
    }
    setSelectedCountryCode("");
  };

  const getContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      getContacts();
    } else {
      console.log("Permission to access contacts denied");
    }
  };

  const handleClosePersonChip = (index) => {
      handleRemovePersonFromAddPeople(index);
  };
  
  const getContacts = async () => {
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Image,
      ],
    });

    const colorMap = {};

    if (data.length > 0) {
      const formattedContacts = data.map((contact) => {
        let imageUri;
        if (contact.image && contact.image.uri) {
          imageUri = contact.image.uri;
        } else {
          const startingLetter = contact.name[0].toUpperCase();
          let textToImageURI;

          if (colorMap[startingLetter]) {
            textToImageURI = `https://ui-avatars.com/api/?name=${startingLetter}&background=${colorMap[startingLetter]}&size=100`;
          } else {
            const randomColor = Math.floor(Math.random() * 16777215).toString(
              16
            );
            colorMap[startingLetter] = randomColor;
            textToImageURI = `https://ui-avatars.com/api/?name=${startingLetter}&background=${randomColor}&size=100`;
          }

          imageUri = textToImageURI;
        }

        return {
          name: contact.name,
          phone: contact.phoneNumbers ? contact.phoneNumbers[0]?.number : "",
          image: String(imageUri),
        };
      });
      setAllPeople(formattedContacts);
    } else {
      console.log("No contacts found");
    }
  };

  const handleRemovePersonFromAddPeople = useCallback(
    (index) => {
      setSelectedPeople((prevSelected) => {
        const updatedSelectedPeople = prevSelected.filter(
          (_, i) => i !== index
        );
        updateData(updatedSelectedPeople);
        return updatedSelectedPeople;
      });
    },
    [updateData]
  );

  const handleAddPersonToSelectedPeople = useCallback(
    (addedPerson) => {
      setErrmessage("");
      const isPersonAlreadyAdded = selectedPeople.some(
        (person) => person.phone === addedPerson.phone
      );

      if (isPersonAlreadyAdded) {
        Toast.show({
          type: "info",
          text1: `${addedPerson.name} is already added.`,
        });
      } else {
        setContactNumber(addedPerson.phone);
        setSelectedContact(addedPerson);
        setIsModalVisible(true);
      }
    },
    [selectedPeople]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.allPeopleItem}>
        <Image source={{ uri: item.image }} style={styles.personAvatar} />
        <Text style={styles.personName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleAddPersonToSelectedPeople(item)}>
          <Text style={styles.addPersonButton}>Add</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleAddPersonToSelectedPeople]
  );


  const filteredPeople = allPeople.filter(
    (person) =>
      person.name.toLowerCase().includes(searchText.toLowerCase()) ||
      person.phone.includes(searchText)
  );

  const renderContactsList = () => {
    if (searchText === "") {
      return null;
    }

    return (
      <Card style={styles.selectedPeopleCard}>
        <Card.Content>
          <FlatList
            data={filteredPeople}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              `${item.name}-${item.phone}-${index}`
            }
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: 50,
              offset: 50 * index,
              index,
            })}
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* {renderGroupDropdown()} */}
      {/* Selected People */}
      <Card style={styles.selectedPeopleCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Added People:</Text>
          <View style={{ maxHeight: 100 }}>
            <FlatList
              data={selectedPeople}
              renderItem={({ item, index }) => (
                <PersonChipMemo
                  person={item}
                  onClose={() => handleClosePersonChip(index)}
                />
              )}
              keyExtractor={(item, index) =>
                `${item.name}-${item.phone}-${index}`
              }
              numColumns={2}
            />
          </View>
        </Card.Content>
      </Card>
      {/* Search Box */}
      {
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search People"
            value={searchText}
            onChangeText={setSearchText}
          />
        </>
      }

      {/* Render contacts list only when there's a search query */}
      {renderContactsList()}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Select Country Code:</Text>
            <Text style={styles.error}>{errMessage}</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCountryCode(value)}
              items={countryCodes}
              style={pickerSelectStyles}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              onChangeText={(text) => setContactNumber(text)}
              keyboardType="numeric"
              value={contactNumber}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Toast messages */}
      <Toast ref={ref} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
  },
  selectedPeopleCard: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  searchInput: {
    height: 40,
    borderColor: "#3498db",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  allPeopleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  personName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  addPersonButton: {
    color: "#3498db",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  modalText: {
    fontSize: 18,
  },
  error: {
    color: "red",
  },
  input: {
    height: 40,
    borderColor: "#3498db",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    paddingRight: 30,
    width: "100%",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 5,
    color: "black",
    paddingRight: 30,
    width: "100%",
  },
});

export default ContactsComponent;
