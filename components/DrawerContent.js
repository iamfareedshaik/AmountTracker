import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

const DrawerContent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/basket.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Add Items</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Home"
          onPress={() => navigation.navigate('Home')}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('Details')}
        />
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
    height: 10, // Adjust the height for desired spacing
  },
});

export default DrawerContent;
