import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import { http } from "../../../Api";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const TransactionItem = ({ item, navigation }) => {
  const dateObject = new Date(item.date);
  const month = dateObject.toLocaleString("default", { month: "long" });
  const day = dateObject.getDate();
  
  const handleItemClick = (navigation) => {
    if (item.share < 0) {
      Alert.alert(
        "Settle Amount",
        `Ask ${item.username} to update.`,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
    else {
      navigation.navigate("SettleAmount", {
        transactionData: item,
      });
    }
  };

  return (
    <TouchableOpacity onPress={() => handleItemClick(navigation)}>
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
    </TouchableOpacity>
  );
};

const PersonTransaction = ({ route, navigation }) => {
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
      payerId = "" + route.params.payerId;
      const response = await http.get(`/expense/${payerId}`);
      const data = response.data;
      setTransactions(data.expenses);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [route.params.userId, route.params.payerId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const renderTransactionItem = ({ item }) => (
    <TransactionItem item={item} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.expense_id}
        renderItem={renderTransactionItem}
      />
      <TouchableOpacity style={styles.historyIcon} onPress={()=> navigation.navigate('History',{payerId:route.params.payerId})}>
        <MaterialIcons name="history" size={30} color="#fff" />
      </TouchableOpacity>
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
  historyIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: "#007BFF",
    borderRadius: 30,
    padding: 12,
  },
});

export default PersonTransaction;
