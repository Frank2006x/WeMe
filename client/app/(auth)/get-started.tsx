import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import api from "@/constants/api";
import { useState, useEffect } from "react";

export default function GetStartedScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("Loading...");
  useEffect(() => {
    api
      .get("/John%20Doe")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setMessage("Error fetching data");
      });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome to WeMe{message && `, ${message}!`}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Connect with friends and family in a whole new way.
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 100,
    paddingBottom: 50,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    opacity: 0.7,
  },
  footer: {
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
