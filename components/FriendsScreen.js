import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { http } from "../Api";

const PeopleListScreen = ({ navigation }) => {
  const [peopleData, setPeopleData] = useState();
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await http.get("/expense");
      const data = response.data;
      setPeopleData(data.expenses);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useFocusEffect will run every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // Refetch data when the FriendsScreen is in focus
    }, [])
  );
  if (loading) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }
  const transactionItems = (item) => {
    navigation.navigate("TrasactionItem", { payerId: item.payer_id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => transactionItems(item)}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{item.username}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text
              style={[
                styles.amountText,
                { color: item.total_amount < 0 ? "#e74c3c" : "#27ae60" }, // Red for Pay, Green for Receive
              ]}
            >
              {item.total_amount == 0 ? "😊" : Math.abs(item.total_amount)}
            </Text>
            <Text style={styles.amountTypeText}>
              {item.total_amount != 0
                ? item.total_amount < 0
                  ? "Pay"
                  : "Receive"
                : "None"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {peopleData?.length ? (
        <FlatList
          data={peopleData}
          keyExtractor={(item) => item.payer_id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text>No Transactions Found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 18,
    marginLeft: 16,
  },
  amountTypeText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});

export default PeopleListScreen;
