import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import api from "../constants/api";
import { useRouter, useSegments } from "expo-router";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "user_token";

function useProtectedRoute(isAuthenticated: boolean, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't redirect until auth state is confirmed

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/get-started");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  useProtectedRoute(isAuthenticated, isLoading);

  const isTokenExpired = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return true;
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token && !isTokenExpired(token)) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthenticated(true);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY); // Clean up expired token
      setAuthenticated(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      await SecureStore.setItemAsync(TOKEN_KEY, token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await api.post("/auth/register", { email, password });
      // After registration, log them in or redirect to login
      await login(email, password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
