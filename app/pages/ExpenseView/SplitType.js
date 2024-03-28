import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useData } from '../../context/DataContext';

const SplitTypeScreen = ({ navigation, route }) => {
  const { SplitType, updateSplitType, sharedData,updateData } = useData();
  const [splitType, setSplitType] = useState(SplitType);
  const [splitValues, setSplitValues] = useState([]);
  
  
  const amount = route.params?.totalAmount;
  const handleSplitTypeChange = (type) => {
    setSplitType(type);
    updateSplitType(type);
  };

  const handleInputValues = (value,index) => {
    const updatedValues = [...splitValues];
    updatedValues[index] = value;
    setSplitValues(updatedValues);
  }

  const updateExpenses = () =>{
    const totalshare = splitValues.reduce((sum,expense) => sum + parseInt(expense),0)
    if(totalshare != amount){
      Alert.alert('Share', `Sum of Shares: ${totalshare} not Equal to Amount: ${amount}`);
      return false;
    }
    const updateExpense = sharedData.map((person, index) => {
      return {name : person.name, phone: person.phone, share: splitValues[index],groupid:person.groupid}
    })
    updateData(updateExpense)
    return true
  }

  const updateEqualExpense = (personShare) =>{
    const updateExpense = sharedData.map((person, index) => {
      return {name : person.name, phone: person.phone, share: personShare[index], groupid:person.groupid}
    })
    updateData(updateExpense)
    return true
  }

  const handleDone = () => {
    switch (splitType) {
      case 'Equally':
        const personShare = sharedData.map(() => amount / sharedData.length)
        if(updateEqualExpense(personShare)){
          navigation.goBack();
        }
        break;
      case 'Unequally':
        if(updateExpenses()){
          navigation.goBack()
        }
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    switch (splitType) {
      case 'Equally':
        return sharedData.map((person, index) => (
          <View key={index} style={styles.personContainer}>
            <Text style={styles.personName}>{person.name}</Text>
            <Text style={styles.personAmount}>{`$${amount / sharedData.length}`}</Text>
          </View>
        ));
      case 'Unequally':
        return sharedData.map((person, index) => (
          <View key={index} style={styles.personContainer}>
            <Text style={styles.personName}>{person.name}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={splitValues[index]}
              onChangeText={(text) => handleInputValues(text,index)}
            />
          </View>
        ));
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={splitType}
        onValueChange={(itemValue) => handleSplitTypeChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Equally" value="Equally" />
        <Picker.Item label="Unequally" value="Unequally" />
      </Picker>
      <ScrollView style={styles.card}>{renderContent()}</ScrollView>
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0F0',
  },
  picker: {
    height: 40,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    maxHeight: 200,
  },
  personContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  personName: {
    fontSize: 16,
    color: '#333',
  },
  personAmount: {
    fontSize: 16,
    color: '#3498db',
  },
  amountInput: {
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    paddingLeft: 10,
  },
  doneButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SplitTypeScreen;
