import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { gobalStyles } from "../Style/globalStyles";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import { useData } from "../app/context/DataContext";
import { http } from "../Api";

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <TouchableOpacity onPress={onChange} style={styles.checkbox}>
      {checked && <FontAwesome name='check' size={18} color='#fff' />}
    </TouchableOpacity>
  );
};

const CartTracker = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basketData, setBasketData] = useState([]);
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemPrices, setItemPrices] = useState({});
  const [flag, setFlag] = useState("false");
  const [mydetails, setmyDetails] = useState();
  const { updateData, updateSplitType } = useData();

  const fetchBasketData = async () => {
    try {
      const response = await http.get("/basket");
      const data = response.data;
      setBasketData(data.baskets);
    } catch (error) {
      // console.error("Error fetching basket data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      if (selectedValue) {
        const response = await http.get(`/cart/${selectedValue.uuid}`);
        const data = response.data;
        setSelectedCartItems(data.cartItems);
      } else {
        setSelectedCartItems([]);
      }
    } catch (error) {
      // console.error("Error fetching cart data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await http.get("/me");
      const data = response.data;
      setmyDetails(data.user);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasketData();
    fetchData();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [selectedValue, flag]);

  const handleValueChange = (basketId) => {
    setSelectedValue(basketId);
  };

  const handlePriceChange = (productId, price) => {
    setItemPrices((prevPrices) => ({
      ...prevPrices,
      [productId]: price,
    }));
  };

  const toggleCheckbox = (productId) => {
    const updatedItems = selectedItems.includes(productId)
      ? selectedItems.filter((id) => id !== productId)
      : [...selectedItems, productId];
    setSelectedItems(updatedItems);
  };

  const handleShare = () => {
    updateData([mydetails]);
    updateSplitType("Equally");
    const totalAmount = selectedCartItems
      .filter((item) => selectedItems.includes(item.productid))
      .reduce(
        (total, item) => total + parseInt(itemPrices[item.productid] || 0),
        0
      );
    navigation.navigate("Expenses Tracker", {
      amount: totalAmount,
      description: selectedValue.basketname,
    });
  };
  const updateamount = async (item, amount) => {
    if (item.price != amount && amount > 0) {
      const response = await http.put("/cart/updatePrice", {
        productId: item.productid,
        uuid: selectedValue.uuid,
        amount: amount,
      });
      const data = response.data;
      if (data.success) {
        Toast.show({
          type: "info",
          text1: `Sucessfully updated amount`,
        });
      }
    }
  };

  const handleRemoveItem = async (item) => {
    setFlag("false");
    const response = await http.put("/cart", {
      productId: item.productid,
      uuid: selectedValue.uuid,
    });
    const data = response.data;
    if (data.success) {
      Toast.show({
        type: "info",
        text1: `${item.name} is successfully deleted`,
      });
    }
    setFlag("true");
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        gobalStyles.itemContainer,
        selectedItems.includes(item.productid) && styles.selectedItem,
      ]}
    >
      <CustomCheckbox
        checked={selectedItems.includes(item.productid)}
        onChange={() => toggleCheckbox(item.productid)}
      />
      <TouchableOpacity
        onPress={() => handleRemoveItem(item)}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Image
        source={{
          uri: `https://expensebucketfareed.s3.us-east-2.amazonaws.com/${item.category}/${item.image}`,
        }}
        style={gobalStyles.itemImage}
      />
      <View style={gobalStyles.itemInfoContainer}>
        <Text style={gobalStyles.itemName}>{item.name}</Text>
        <Text style={gobalStyles.itemDescription}>{item.description}</Text>
        <View style={styles.quantityUnitsContainer}>
          <Text style={styles.cardQuantity}>{`${item.qty} `}</Text>
          <Text style={styles.cardUnits}>{`${item.units}`}</Text>
        </View>
      </View>
      <View style={styles.priceInput}>
        <TextInput
          placeholder={item.price}
          value={itemPrices[item.productid]?.toString() || ""}
          onChangeText={(text) => handlePriceChange(item.productid, text)}
          keyboardType='numeric'
          onEndEditing={() => updateamount(item, itemPrices[item.productid])}
        />
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
        style={pickerSelectStyles.inputIOS}
      >
        <Picker.Item label='Select a cart' value={null} />
        {basketData.map((basket) => (
          <Picker.Item
            key={basket.uuid}
            label={basket.basketname}
            value={basket}
          />
        ))}
      </Picker>
      {selectedCartItems && (
        <FlatList
          data={selectedCartItems}
          keyExtractor={(item) => item.productid.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 65 }}
        />
      )}
      {selectedCartItems.length > 0 && (
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text>Split</Text>
        </TouchableOpacity>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  quantityUnitsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  container: {
    flex: 1,
  },
  shareButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 50,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "rgb(115 95 95)",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardQuantity: {
    fontSize: 14,
  },
  cardUnits: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  priceInput: {
    maxWidth: 50,
    borderWidth: 1,
    borderColor: "#3498db",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#3498db",
    color: "black",
    paddingRight: 30,
    backgroundColor: "#a6c4cc",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#3498db",
    color: "black",
    paddingRight: 30,
    backgroundColor: "#a6c4cc",
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
};

export default CartTracker;
