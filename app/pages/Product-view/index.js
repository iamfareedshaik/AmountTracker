// App.js
import React, { useState } from "react";
import { SafeAreaView } from 'react-native';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { data as initialData } from "../../../data";
import { gobalStyles } from "../../../Style/globalStyles";
const ProductView = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(initialData);

  const handleFolderPress = (navigation, folder) => {
    if (folder.items) {
      navigation.navigate("Stack", { folder, title: folder.name });
    } else {
      navigation.navigate("Stack", {
        folder: { items: [folder] },
        title: folder.name,
      });
    }
  };

  const renderItem = ({ item, navigation }) => (
    <TouchableOpacity onPress={() => handleFolderPress(navigation, item.item)}>
      <View style={gobalStyles.folderContainer}>
        <Image source={item.item.image} style={gobalStyles.folderImage} />
        <Text style={gobalStyles.folderName}>{item.item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item.id.toString();

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredData(initialData);
    } else {
      const matchingItems = initialData.flatMap((folder) =>
        folder.items.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        )
      );

      setFilteredData(matchingItems);
    }
  };

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
        placeholder="Search for Item"
        onChangeText={handleSearch}
        value={searchText}
      />
      <FlatList
        data={searchText ? filteredData : filteredData}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 65 }}
        renderItem={(item) => renderItem({ item, navigation })}
      />
    </SafeAreaView>
  );
};


export default ProductView;
