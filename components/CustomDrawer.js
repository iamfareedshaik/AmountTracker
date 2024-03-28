import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CustomDrawer = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigateToScreen('Group')} style={styles.button}>
        <Text style={styles.buttonText}>Group</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateToScreen('Friends')} style={styles.button}>
        <Text style={styles.buttonText}>Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateToScreen('Transactions')} style={styles.button}>
        <Text style={styles.buttonText}>Transactions</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomDrawer;
