// BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FriendsScreen from './FriendsScreen';
import TransactionsScreen from './TransactionsScreen';
import { AntDesign } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Friends"
      component={FriendsScreen}
      options={{
        headerShown: false,
        lazy: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="History"
      component={TransactionsScreen}
      options={{
        headerShown: false,
        tabBarIcon: () => (
            <AntDesign name="swap" size={24} color="black" />
        ),
      }}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
