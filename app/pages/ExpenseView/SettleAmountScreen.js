import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";
import { http } from '../../../Api';

const SettleAmountScreen = ({ route, navigation }) => {
  const { transactionData } = route.params;
  const [settlementOption, setSettlementOption] = useState('complete');
  const [partialAmount, setPartialAmount] = useState('');

  const handleSettleAmount = async () => {
    const partialAmt = partialAmount ? parseFloat(partialAmount) : 0;
    const totalAmount = parseFloat(transactionData.share);
    
    if (partialAmt > totalAmount) {
      Alert.alert(
        'Invalid Partial Amount',
        'Partial amount cannot be greater than the total amount.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
      return;
    }
  
    const amount = totalAmount - partialAmt;
    const settlementData = {
      expense_id: transactionData.expense_id,
      payer_id: transactionData.payer_id,
      settlementOption,
      amount: settlementOption === 'partial' ? amount : 0,
      description:transactionData.description,
      partialAmt: settlementOption === 'partial' ? partialAmt : totalAmount
    };
  
    try {
      const response = await http.post('/expense/share/payerId', settlementData);
      const responseData = response.data;
    } catch (error) {
      console.error('API Error:', error);
    }
  
    navigation.goBack();
  };  

  const handleDeleteTransaction = async () => {
    try {
      const {expense_id, payer_id, description, share,actualshare } = transactionData;
      const deleteObject = {expense_id, payer_id, description, share,actualshare }
      const urlParams = new URLSearchParams(deleteObject);
      const response = await http.delete(`/expense?${urlParams.toString()}`);
      const responseData = response.data;
      navigation.goBack();
    } catch (error) {
      console.error('Delete API Error:', error);
      Alert.alert(
        'Error',
        'Failed to delete transaction. Please try again later.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settle Amount</Text>
      <View style={styles.card}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Transaction Details:</Text>
          <Text>{`Total Amount: $${transactionData.share}`}</Text>
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsText}>Select Settlement Option:</Text>
          <Picker
            style={styles.picker}
            selectedValue={settlementOption}
            onValueChange={(itemValue) => setSettlementOption(itemValue)}
          >
            <Picker.Item label="Complete Amount" value="complete" />
            <Picker.Item label="Partial Amount" value="partial" />
          </Picker>
        </View>
        {settlementOption === 'partial' && (
          <View style={styles.partialAmountContainer}>
            <Text style={styles.partialAmountText}>Enter Partial Amount:</Text>
            <TextInput
              style={styles.partialAmountInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={partialAmount}
              onChangeText={(text) => setPartialAmount(text)}
            />
          </View>
        )}
        <TouchableOpacity style={styles.settleButton} onPress={handleSettleAmount}>
          <Text style={styles.buttonText}>Settle Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTransaction}>
          <MaterialIcons name="delete" size={24} color="#e74c3c" />
          <Text style={styles.deleteButtonText}>Delete Transaction</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3498db',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    elevation: 2,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
  partialAmountContainer: {
    marginBottom: 16,
  },
  partialAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  partialAmountInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
  },
  settleButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#e74c3c',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettleAmountScreen;
