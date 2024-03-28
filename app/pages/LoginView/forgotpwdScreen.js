import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const ForgotpwdScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");

  const handleForgotPassword = async () => {
    try {
      if (!email || !secret) {
        Alert.alert(
          "Validation Error",
          "Please fill in both email and secret fields.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        return;
      }

      const response = await fetch(
        "http://192.168.4.21:8080/api/v1/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, secret }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        Alert.alert(
          "Validation Error",
          "Please enter correct email and secret values.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        return;
      }

      navigation.navigate("ResetPassword", {
        email,
        phoneNumber: data.response[0].phonenumber,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      // Handle error, e.g., show an error message to the user
      Alert.alert(
        "Error",
        "Failed to reset password. Please try again later.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter your email'
        keyboardType='email-address'
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter secret'
        secureTextEntry={true}
        value={secret}
        onChangeText={(text) => setSecret(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotpwdScreen;
