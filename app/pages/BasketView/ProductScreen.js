import React, { memo, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { gobalStyles } from "../../../Style/globalStyles";
import ModalComponent from "./ModalComponent";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { http } from "../../../Api";

const ProductScreen = memo(({ route }) => {
  const { title, uuid } = route.params;
  const [data, setData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [quantity, setQuantity] = useState();
  const [updateBasketFlag, setUpdateBasketFlag] = useState("false");
  const [selectedUnit, setSelectedUnit] = useState("kg");
  const [newProductName, setNewProductName] = useState("");
  const [newProductImage, setNewProductImage] = useState(null);
  const [baseImage, setBaseImage] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        base64: true,
      });
      if (pickerResult.canceled === true) {
        return;
      }

      const base64Image = await pickerResult.assets[0].base64;
      setBaseImage(base64Image);
      setBaseImage(pickerResult.assets[0].base64);
      setNewProductImage(pickerResult);
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (!newProductName.trim()) {
        Alert.alert("Please enter a product name.");
        return;
      }
      const formData = new FormData();
      formData.append("image", baseImage);
      formData.append("name", newProductName);
      formData.append("bucket", title);
      formData.append("uuid", uuid);
      const response = await http.put(`/products/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Indicate FormData content
        },
      });
      setNewProductName(null);
      setNewProductImage(null);
      fetchCategoryData();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const fetchCategoryData = async () => {
    let category = route.params?.category;
    try {
      if (category) {
        const response = await http.get(
          `/products/?category=${category}&uuid=${uuid}`
        );
        const { categoryItems } = response.data;
        setData(categoryItems);
      }
      if (route.params?.searchName) {
        const response = await http.get(
          `/products/search/?searchtext=${route.params?.searchName}&uuid=${uuid}`
        );
        const { products } = response.data;
        setData(products);
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [route.params?.category, updateBasketFlag]);

  const handleConfirm = async (selectedItem) => {
    const { productid } = selectedItem;
    try {
      const response = await http.put(`/basket/${productid}`, {
        uuid: uuid,
        id: productid,
        qty: quantity,
        units: selectedUnit,
      });
      const { success } = response.data;
      if (success) {
        setUpdateBasketFlag(true);
      }
    } catch (error) {
      // console.error("Error updating basket:", error);
    } finally {
      setUpdateBasketFlag(false);
      setQuantity();
      setSelectedUnit("kg");
      toggleModal();
    }
  };

  const handleAddItem = (item) => {
    setModalItem(item);
    toggleModal();
  };

  const editCard = (item) => {
    setModalItem(item);
    toggleModal();
  };
  return (
    <View>
      <Text style={gobalStyles.header}>{title}</Text>
      <View style={gobalStyles.itemContainer}>
        <TouchableOpacity onPress={handleImageUpload}>
          {newProductImage ? (
            <Image
              source={{ uri: newProductImage.assets[0].uri }}
              style={gobalStyles.itemImage}
            />
          ) : (
            <Image
              source={require("../../../assets/capture.jpg")}
              style={gobalStyles.itemImage}
            />
          )}
        </TouchableOpacity>
        <View style={gobalStyles.itemInfoContainer}>
          <TextInput
            placeholder='Create Product'
            value={newProductName}
            onChangeText={setNewProductName}
            style={gobalStyles.itemName}
          />
        </View>
        <View style={gobalStyles.buttonContainer}>
          <TouchableOpacity
            style={gobalStyles.addButton}
            onPress={handleCreateProduct}
          >
            <Text style={gobalStyles.addButtonText}>create</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.productid.toString()}
        contentContainerStyle={{ paddingBottom: 65 }}
        renderItem={({ item }) => {
          let product = `${title}/${item.image}`;
          return (
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={gobalStyles.itemContainer}>
                <Image
                  source={{
                    uri: `https://expensebucketfareed.s3.us-east-2.amazonaws.com/${product}`,
                  }}
                  style={gobalStyles.itemImage}
                />
                <View style={gobalStyles.itemInfoContainer}>
                  <Text style={gobalStyles.itemName}>{item.name}</Text>
                  <Text style={gobalStyles.itemDescription}>
                    {item.description}
                  </Text>
                </View>
                <View style={gobalStyles.buttonContainer}>
                  {item.qty > 0 ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text>{`${item.qty} ${item.units}`}</Text>
                      <MaterialCommunityIcons
                        name='pencil'
                        size={24}
                        color='black'
                        onPress={() => editCard(item)}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={gobalStyles.addButton}
                      onPress={() => {
                        setQuantity(item.qty);
                        setSelectedUnit(item.units);
                        handleAddItem(item);
                      }}
                    >
                      <Text style={gobalStyles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
      />
      <ModalComponent
        closeModal={toggleModal}
        isVisible={isModalVisible}
        handleAddItem={handleAddItem}
        item={modalItem}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        quantity={quantity}
        setQuantity={setQuantity}
        handleConfirm={handleConfirm}
      />
    </View>
  );
});

export default ProductScreen;
