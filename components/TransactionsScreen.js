import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import http from "../Api";
const TransactionScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const transactions = await http.get("/expense/transactions");
      const data = transactions.data;
      setTransactions(data.transactions);
    } catch (error) {
      // Handle error as needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // Refetch data when the FriendsScreen is in focus
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Image
        source={require("../assets/transactions.png")}
        style={styles.transactionImage}
      />
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionTime}>{formatTime(item.date)}</Text>
      </View>
    </View>
  );

  const formatTime = (isoTime) => {
    const transactionDate = new Date(isoTime);
    const currentDate = new Date();
    const timeDifference = currentDate - transactionDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (timeDifference < oneDayInMilliseconds) {
      // Display time with AM/PM
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return `Today, ${transactionDate.toLocaleTimeString("en-US", options)}`;
    } else if (timeDifference < 2 * oneDayInMilliseconds) {
      // Display time with AM/PM
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return `1 day ago, ${transactionDate.toLocaleTimeString(
        "en-US",
        options
      )}`;
    } else if (timeDifference < 7 * oneDayInMilliseconds) {
      const daysAgo = Math.floor(timeDifference / oneDayInMilliseconds);
      // Display time with AM/PM
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return `${daysAgo} days ago, ${transactionDate.toLocaleTimeString(
        "en-US",
        options
      )}`;
    } else {
      // Format date as "Dec 10 2023, 5:28 PM"
      const options = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return transactionDate.toLocaleDateString("en-US", options);
    }
  };

  return (
    <View style={styles.container}>
      {transactions.length ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.transactionid}
          renderItem={renderTransactionItem}
        />
      ) : (
        <Text>No History Details Found</Text>
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
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  transactionImage: {
    width: 30,
    height: 30,
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
  transactionTime: {
    color: "#888",
    fontSize: 14,
  },
});

export default TransactionScreen;
