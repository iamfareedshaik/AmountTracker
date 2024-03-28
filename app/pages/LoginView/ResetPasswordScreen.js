import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email, phoneNumber } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert(
        "Validation Error",
        "Please fill in both password and confirm password fields.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Validation Error",
        "Password and confirm password do not match.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.4.21:8080/api/v1/updatepassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password: confirmPassword,
            phonenumber: phoneNumber,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        Alert.alert(
          "Error",
          "Failed to reset password. Please try again later.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        return;
      }

      Alert.alert(
        "Password Reset",
        "Your password has been successfully reset.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert(
        "Error",
        "Failed to reset password. Please try again later.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.emailText}>Email: {email}</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter new password'
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Confirm new password'
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
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
  emailText: {
    fontSize: 18,
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

export default ResetPasswordScreen;
