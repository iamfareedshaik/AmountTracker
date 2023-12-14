import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductView from './app/pages/Product-view';
import DrawerContent from './components/DrawerContent';
import DetailsScreen from './components/DetailsScreen';
import FolderScreen from './components/FolderScreen'
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={ProductView} />
      <Drawer.Screen name="Details" component={DetailsScreen} />
    </Drawer.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Drawer" >
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="Stack" component={FolderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
