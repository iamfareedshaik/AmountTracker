import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import { useToken } from "../../context/TokenContext";
import RNPickerSelect from "react-native-picker-select";
import { countryCodes } from "../../../countryCodes";

const RegisterScreen = ({ navigation }) => {
  const { getToken } = useToken();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [secret, setSecret] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !selectedCountryCode ||
      !secret
    ) {
      setErrorMessage("Please enter all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    try {
      const response = await fetch("http://192.168.4.21:8080/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          username: name,
          password: confirmPassword,
          phonenumber: selectedCountryCode + phoneNumber,
          secret: secret,
        }),
      });
      const data = await response.json();
      const tokenRes = await getToken(email.toLowerCase(), password);
      const token = tokenRes.token;
      await fetch("http://192.168.4.21:8080/api/v1/basket/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: "Bag 1",
        }),
      });
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
      <TextInput
        placeholder='Name'
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder='Email'
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder='Password'
        secureTextEntry={true}
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        placeholder='Confirm Password'
        secureTextEntry={true}
        style={styles.input}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TextInput
        placeholder='Enter Secret for password reset'
        secureTextEntry={true}
        style={styles.input}
        value={secret}
        onChangeText={(text) => setSecret(text)}
      />
      <View style={styles.inputContainer}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedCountryCode(value)}
            items={countryCodes.map((code) => ({
              label: code.label,
              value: code.value,
            }))}
            placeholder={{ label: "Select Country Code", value: null }}
            style={pickerSelectStyles}
          />
        </View>
        <TextInput
          placeholder='Phone Number'
          style={[styles.input, { flex: 1 }]}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          keyboardType='phone-pad'
        />
      </View>

      {errorMessage ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}
      <Button
        mode='contained'
        onPress={handleRegister}
        style={{ backgroundColor: "#4CAF50", height: 50, marginBottom: 10 }}
        labelStyle={{ fontSize: 18 }}
      >
        Register
      </Button>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: "center", color: "blue", fontSize: 16 }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1, // Adjust this value as needed to control the width of the picker
    marginRight: 10,
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    borderColor: "#ced4da",
    borderRadius: 4,
    backgroundColor: "white",
    color: "black",
  },
  inputAndroid: {
    fontSize: 16,
    borderColor: "#ced4da",
    borderRadius: 4,
    backgroundColor: "white",
    color: "black",
  },
});

export default RegisterScreen;
