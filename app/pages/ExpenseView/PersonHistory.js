import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { http } from "../../../Api";

const PersonHistoryItem = ({ item, navigation }) => {
  const dateObject = new Date(item.date);
  const month = dateObject.toLocaleString("default", { month: "long" });
  const day = dateObject.getDate();

  return (
    <View style={styles.transactionItem}>
      <View style={styles.dateContainer}>
        <Text style={styles.transactionMonth}>{month}</Text>
        <Text style={styles.transactionDay}>{day}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.transactionImage} />
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <View>
          <Text style={styles.transactionText}>{item.username} Paid </Text>
          <Text>${item.totalamount}</Text>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            { color: item.share < 0 ? "#e74c3c" : "#27ae60" },
          ]}
        >
          ${Math.abs(item.share)}
        </Text>
        <Text style={styles.amountTypeText}>
          {item.share < 0 ? "Pay" : "Receive"}
        </Text>
      </View>
    </View>
  );
};

const PersonHistory = ({ route, navigation }) => {
  const { payerId } = route.params;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.get(`/expense/history/${payerId}`);
        const data = response.data;
        setHistory(data.history);
      } catch (error) {
        // Handle error as needed
      }
    };

    fetchData();
  }, [route.params.payerId]);

  const renderHistoryItem = ({ item }) => (
    <PersonHistoryItem item={item} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.expense_id}
        renderItem={renderHistoryItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  dateContainer: {
    marginRight: 8,
    alignItems: "center",
  },
  transactionMonth: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
  },
  transactionDay: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
  },
  transactionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  transactionText: {
    color: "#888",
    fontSize: 14,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amountTypeText: {
    fontSize: 12,
    color: "#888",
  },
});

export default PersonHistory;
