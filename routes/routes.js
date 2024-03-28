import React from "react";
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SideBar from "../components/SideBar";
import BasketHeader from "../components/BasketHeader";
import CategoryScreen from "../app/pages/BasketView/CategoryScreen";
import ProductScreen from "../app/pages/BasketView/ProductScreen";
import CartTracker from "../components/Cart-Tracker";
import ExpenseSplitPage from "../app/pages/ExpenseView";
import AddedPeopleScreen from "../app/pages/ExpenseView/AddedPeopleScreen";
import { Ionicons } from "@expo/vector-icons";
import ExpenseHeader from "../components/ExpenseHeader";
import { DataProvider } from "../app/context/DataContext";
import SplitTypeScreen from "../app/pages/ExpenseView/SplitType";
import BottomTabNavigator from "../components/BottomTabNavigator";
import PersonTransaction from "../app/pages/ExpenseView/PersonTransaction";
import LoginScreen from "../app/pages/LoginView/LoginScreen";
import { useToken } from "../app/context/TokenContext";
import ProfileScreen from "../components/ProfileScreen";
import RegisterScreen from "../app/pages/LoginView/RegisterScreen";
import ForgotpwdScreen from "../app/pages/LoginView/forgotpwdScreen";
import PersonTransactionHeader from "../components/PersonTransactionHeader";
import SettleAmountScreen from "../app/pages/ExpenseView/SettleAmountScreen";
import PersonHistory from "../app/pages/ExpenseView/PersonHistory";
import ResetPasswordScreen from "../app/pages/LoginView/ResetPasswordScreen";
const Drawer = createDrawerNavigator();
import addContacts from "../components/addContacts";
const Stack = createNativeStackNavigator();
export const navigationRef = React.createRef();

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <SideBar {...props} />}>
    <Drawer.Screen
      name="Home"
      component={CategoryScreen}
      options={({ navigation, route }) => ({
        headerTitle: "",
        headerRight: () => <BasketHeader navigation={navigation} />,
      })}
    />
    <Drawer.Screen
      name="ShareExpenses"
      component={BottomTabNavigator}
      options={({ navigation, route }) => ({
        headerTitle: "",
        headerRight: () => <ExpenseHeader navigation={navigation} />,
      })}
    />
  </Drawer.Navigator>
);

const RootNavigator = () => {
  const { isAuthenticated, loading } = useToken();
  if (loading) {
    return (
      <>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </>
    );
  }
  return isAuthenticated ? (
    <NavigationContainer ref={navigationRef}>
      <DataProvider>
        <Stack.Navigator initialRouteName="Drawer">
          <Stack.Screen
            name="Expense Tracker"
            component={DrawerNavigator}
            options={({ navigation, route }) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Cart Tracker");
                  }}
                  style={{ marginRight: 16 }}
                >
                  <Ionicons name="cart-outline" size={24} color="black" />
                </TouchableOpacity>
              ),
            })}
          />

          <Stack.Screen name="AddedPeople" component={AddedPeopleScreen} />
          <Stack.Screen name="Add Items to Basket" component={ProductScreen} />
          <Stack.Screen name="Cart Tracker" component={CartTracker} />
          <Stack.Screen name="Expenses Tracker" component={ExpenseSplitPage} />
          <Stack.Screen name="Split Type" component={SplitTypeScreen} />
          <Stack.Screen
            name="TrasactionItem"
            component={PersonTransaction}
            options={({ navigation, route }) => ({
              headerRight: () => (
                <PersonTransactionHeader
                  navigation={navigation}
                  route={route}
                />
              ),
            })}
          />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="SettleAmount" component={SettleAmountScreen} />
          <Stack.Screen name="History" component={PersonHistory} />
          <Stack.Screen name="AddContacts" component={addContacts} />
        </Stack.Navigator>
      </DataProvider>
    </NavigationContainer>
  ) : (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen name="forgotpwd" component={ForgotpwdScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
