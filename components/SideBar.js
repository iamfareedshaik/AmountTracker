import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
const SideBar = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ProfileScreen')}>
          <MaterialCommunityIcons name="account-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
      <Image
        source={require('../images/basket.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Add Items</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.home} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Basket</Text>
        </TouchableOpacity>
        <View style={styles.buttonSpacing} />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ShareExpenses')}>
          <Text style={styles.buttonText}>Split Amount</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    marginBottom: 30,
  },
  profileButton: {
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'column',
  },
  buttonSpacing: {
    height: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  home: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  }
});

export default SideBar;
