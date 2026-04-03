import axios from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_token";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Use an interceptor to attach the token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
