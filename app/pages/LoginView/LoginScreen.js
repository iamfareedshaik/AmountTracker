import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
// import { SocialIcon } from 'react-native-elements';
import { useToken } from "../../context/TokenContext";

const LoginScreen = ({navigation}) => {
  const { getToken } = useToken();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }
    setErrorMessage('');
    try {
      const response = await getToken(username, password);

      if (!response.success) {
        setErrorMessage(response.message);
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your username and password');
    }

    await getToken(username, password);
  };

  const handleForgotPassword = () => {
    navigation.navigate('forgotpwd');
  };

  const handleGoogleSignIn = async () => {
    // Implement your Google Sign-In logic here
  };

  const handleRegister = () => {
    navigation.navigate("register")
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Username"
        style={{ height: 50, borderBottomWidth: 2, marginBottom: 20, fontSize: 16 }}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={{ height: 50, borderBottomWidth: 2, marginBottom: 20, fontSize: 16 }}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={{ backgroundColor: '#4CAF50', height: 50, marginBottom: 10 }}
        labelStyle={{ fontSize: 18 }}
      >
        Login
      </Button>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={{ textAlign: 'center', color: 'blue', fontSize: 16 }}>
          Register
        </Text>
      </TouchableOpacity>
      <Text
        style={{ textAlign: 'center', color: 'blue', marginTop: 10, fontSize: 16 }}
        onPress={handleForgotPassword}
      >
        Forgot Password?
      </Text>
      {/* <View style={{ marginTop: 20 }}>
        <SocialIcon
          title="Sign In With Google"
          button
          type="google"
          onPress={handleGoogleSignIn}
        />
      </View> */}
    </View>
  );
};

export default LoginScreen;
