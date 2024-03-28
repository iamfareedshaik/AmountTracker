import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const http = axios.create({
  baseURL: "http://192.168.4.21:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    return null;
  }
};

const refreshToken = async () => {
  try {
    const refToken = await AsyncStorage.getItem("refreshToken");
    const response = await http.post("/refresh/token", {
      refreshToken: refToken,
    });
    const { accessToken, refreshToken } = response.data;
    await AsyncStorage.setItem("isAuthenticated", "true");
    await AsyncStorage.setItem("token", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    return accessToken;
  } catch (error) {
    return null;
  }
};

http.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedRequestsQueue = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedRequestsQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `${token}`;
          return http(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `${newToken}`;
          processQueue(null, newToken);
          return http(originalRequest);
        } else {
          const error = new Error("Token refresh failed");
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (error) {
        processQueue(error, null);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default http;
