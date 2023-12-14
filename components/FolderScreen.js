import React, { memo, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Button,
  Image,
} from "react-native";
import { gobalStyles } from "../Style/globalStyles";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const FolderScreen = memo(({ route }) => {
  const { folder, title } = route.params;
  const [cart, setCart] = useState({}); // State to keep track of item counts in the cart
  const handleIncrement = (itemId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const handleDecrement = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[itemId] && updatedCart[itemId] > 0) {
        updatedCart[itemId] -= 1;
      }
      return updatedCart;
    });
  };

  const getItemCount = (itemId) => cart[itemId] || 0;

  return (
    <View>
      <Text style={gobalStyles.header}>{title}</Text>
      <FlatList
        data={folder.items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 65 }}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={gobalStyles.itemContainer}>
              <Image source={item.image} style={gobalStyles.itemImage} />
              <View style={gobalStyles.itemInfoContainer}>
                <Text style={gobalStyles.itemName}>{item.name}</Text>
                <Text style={gobalStyles.itemDescription}>{item.description}</Text>
              </View>
              <View style={gobalStyles.buttonContainer}>
                <Button
                  title="-"
                  onPress={() => handleDecrement(item.id)}
                  color="#FF6F61"
                />
                <Text style={gobalStyles.itemCount}>{getItemCount(item.id)}</Text>
                <Button
                  title="+"
                  onPress={() => handleIncrement(item.id)}
                  color="#77DD77"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
});



export default FolderScreen;