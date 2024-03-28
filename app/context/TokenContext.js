import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const storeAuthenticationState = async (isAuthenticated) => {
    await AsyncStorage.setItem("isAuthenticated", isAuthenticated.toString());
  };

  const loadAuthenticationState = async () => {
    const isAuthenticatedString = await AsyncStorage.getItem("isAuthenticated");
    setLoading(false);
    return isAuthenticatedString ? JSON.parse(isAuthenticatedString) : false;
  };

  const refreshToken = async () => {
    setIsAuthenticated(true);
    const refToken = await AsyncStorage.getItem("refreshToken");
    const response = await fetch(
      "http://192.168.4.21:8080/api/v1/refresh/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: refToken,
        }),
      }
    );
    const data = await response.json();

    if (!data.success) {
      await storeAuthenticationState(false);
      setIsAuthenticated(false);
      return data;
    }
    const { accessToken, refreshToken } = data.token;
    await AsyncStorage.setItem("token", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await storeAuthenticationState(true);
    setIsAuthenticated(true);
    return data;
  };

  const handleLogout = async () => {
    const response = await fetch("http://192.168.4.21:8080/api/v1/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    await AsyncStorage.removeItem("token");
    await storeAuthenticationState(false);
    setIsAuthenticated(false);
  };

  const getToken = async (username, password) => {
    const response = await fetch("http://192.168.4.21:8080/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username.toLowerCase(),
        password: password,
      }),
    });
    const data = await response.json();

    if (!data.success) {
      await storeAuthenticationState(false);
      setIsAuthenticated(false);
      return data;
    }
    const { accessToken, refreshToken } = data;
    await AsyncStorage.setItem("token", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await storeAuthenticationState(true);
    setIsAuthenticated(true);
    return data;
  };

  const eventListener = async (event, error) => {
    switch (event.type) {
      case "token":
        await getToken();
        break;
      case "onTokenExpired":
        await refreshToken();
        break;
      case "onAuthLogout":
        await handleLogout();
        break;
      default:
        console.log("Event ", event, error);
    }
  };

  useEffect(() => {
    const loadAuthentication = async () => {
      const isAuthenticated = await loadAuthenticationState();
      setIsAuthenticated(isAuthenticated);
      setLoading(false);
    };
    // handleLogout();
    loadAuthentication();
  }, []);

  return (
    <TokenContext.Provider
      value={{ eventListener, isAuthenticated, loading, getToken }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenData must be used within a TokenProvider");
  }
  return context;
};
