// screens/DetailsScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const DetailsScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Details Screen</Text>
      <Button
        title="Go to Stack Navigator"
        onPress={() => navigation.navigate('Stack')}
      />
    </View>
  );
};

export default DetailsScreen;
