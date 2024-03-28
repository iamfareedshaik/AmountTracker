import React, { useState, useEffect } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { gobalStyles } from "../../../Style/globalStyles";
import { http } from "../../../Api";
import { useData } from "../../context/DataContext";

const CategoryScreen = ({ navigation }) => {
  const { basketid } = useData();
  const [searchText, setSearchText] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryData = async () => {
    try {
      const response = await http.get("/products/category");
      const { products } = response.data;
      setInitialData(products);
    } catch (error) {
      // console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = debounce(async (term) => {
    try {
      const response = await http.get(
        `/products/search/?searchtext=${term}&uuid=${basketid}`
      );
      const { products } = response.data;
      setInitialData(products);
      if (!term) {
        fetchCategoryData();
      }
    } catch (error) {
      // console.error("Error searching:", error);
    }
  }, 500);

  useEffect(() => {
    fetchCategoryData();
  }, [basketid]);

  const handleFolderPress = (navigation, folder) => {
    const { categoryname, name } = folder;
    navigation.navigate("Add Items to Basket", {
      title: categoryname,
      uuid: basketid,
      category: categoryname,
      searchName: name,
    });
  };

  const renderItem = ({ category, navigation }) => {
    const { item } = category;
    const product = `${item.image}`;
    return (
      <TouchableOpacity onPress={() => handleFolderPress(navigation, item)}>
        <View style={gobalStyles.folderContainer}>
          <Image
            source={{
              uri: `https://expensebucketfareed.s3.us-east-2.amazonaws.com/${product}`,
            }}
            style={gobalStyles.folderImage}
          />
          <Text style={gobalStyles.folderName}>
            {!searchText ? item.categoryname : item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item) =>
    item.categoryid ? item.categoryid.toString() : item.productid.toString();

  const handleSearch = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  if (loading) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          margin: 10,
          padding: 10,
        }}
        placeholder='Search for Item'
        onChangeText={handleSearch}
        value={searchText}
      />
      <FlatList
        data={initialData}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 65 }}
        renderItem={(category) => renderItem({ category, navigation })}
      />
    </SafeAreaView>
  );
};

export default CategoryScreen;
