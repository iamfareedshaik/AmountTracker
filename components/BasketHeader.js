import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { http } from "../Api";
import { useData } from "../app/context/DataContext";

const BasketHeader = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [confirmBag, setBag] = useState();
  const [basketName, setBasketName] = useState("");
  const [basketData, setBasketData] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const { updateBasketId } = useData();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setErrorMessage("");
  };

  const fetchBasketData = async () => {
    try {
      const response = await http.get('/basket')
      const { baskets } = response.data;
      setBasketData(baskets);
      setSelectedOption(baskets[baskets.length -1].uuid)
      updateBasketId(baskets[baskets.length -1].uuid)
      navigation.navigate("Home");
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBasketData();
  }, [confirmBag]);

  const validateBasketName = () => {
    if (!basketName) {
      setErrorMessage("Please Enter Basket name");
      return;
    }
  };

  const createBasket = async () => {
    const response = await http.post("/basket/create", {
      name: basketName,
    });
    return response.data;
  };

  const handleConfirmBasket = async () => {
    try {
      validateBasketName();
      const {basketName, uuid} = await createBasket();
      setBag(basketName);
      toggleModal();
      setBasketName("");
      updateBasketId(uuid);
      navigation.navigate("Home");
    } catch (error) {
      // console.error("Error making service call:", error);
    }
  };

  const updateBag = (itemValue) => {
    setSelectedOption(itemValue);
    updateBasketId(itemValue)
    navigation.navigate("Home");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
      }}
    >
      {basketData && (
        <View style={{ flex: 1, alignItems: "center" }}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={updateBag}
            style={{ height: 50, width: 150 }}
          >
            {basketData.map((bag, index) => (
              <Picker.Item key={index} label={bag.basketname} value={bag.uuid} />
            ))}
          </Picker>
        </View>
      )}

      <TouchableOpacity
        onPress={toggleModal}
        style={{
          marginLeft: 16,
          backgroundColor: "#00ddeb",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Create</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: 300,
                  padding: 20,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity
                  style={{ position: "absolute", top: 10, right: 10 }}
                  onPress={toggleModal}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  Enter Basket Name
                </Text>
                {errorMessage ? (
                  <Text style={{ color: "red", marginBottom: 10 }}>
                    {errorMessage}
                  </Text>
                ) : null}
                <TextInput
                  placeholder="Basket Name"
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                  onChangeText={(text) => setBasketName(text)}
                />
                <TouchableOpacity
                  onPress={handleConfirmBasket}
                  style={{
                    backgroundColor: "#af40ff",
                    paddingVertical: 10,
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default BasketHeader;
