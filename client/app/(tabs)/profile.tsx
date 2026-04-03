import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Buffer } from "buffer";
import { useFocusEffect, useRouter } from "expo-router";
import api from "@/constants/api";
import { useAuth } from "@/context/auth-context";

import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrImageUri, setQrImageUri] = useState("");
  const [generatingQr, setGeneratingQr] = useState(false);
  const [qrError, setQrError] = useState("");
  const router = useRouter();
  const { logout } = useAuth();

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    return Buffer.from(buffer).toString("base64");
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/profiles/me");
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, []),
  );

  const handleLogout = async () => {
    await logout();
  };

  const handleGenerateQr = async () => {
    setGeneratingQr(true);
    setQrError("");

    try {
      const response = await api.post("/qr/generate", null, {
        responseType: "arraybuffer",
      });

      const base64 = arrayBufferToBase64(response.data as ArrayBuffer);
      setQrImageUri(`data:image/png;base64,${base64}`);
    } catch {
      setQrError("Failed to generate QR code. Please try again.");
    } finally {
      setGeneratingQr(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.crop.circle.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          {loading ? "Loading..." : profile?.name || "No Profile"}
        </ThemedText>
      </ThemedView>

      <ThemedText>
        {profile?.bio?.String || "Edit your profile to add a bio."}
      </ThemedText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/edit-profile")}
      >
        <Text style={styles.buttonText}>
          {profile ? "Edit Profile" : "Create Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.qrButton]}
        onPress={handleGenerateQr}
        disabled={generatingQr}
      >
        <Text style={styles.buttonText}>
          {generatingQr ? "Generating..." : "Generate My QR"}
        </Text>
      </TouchableOpacity>

      {generatingQr && <ActivityIndicator size="large" style={styles.loader} />}

      {!!qrError && <ThemedText style={styles.errorText}>{qrError}</ThemedText>}

      {!!qrImageUri && (
        <ThemedView style={styles.qrCard}>
          <ThemedText type="subtitle">My Share QR</ThemedText>
          <Image source={{ uri: qrImageUri }} style={styles.qrImage} />
          <ThemedText>Let others scan this code from their Scan tab.</ThemedText>
        </ThemedView>
      )}

      <Collapsible title="Profile features">
        <ThemedText>
          This tab is for profile management. You can edit your information,
          view settings, and more.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev">
          <ThemedText type="link">Learn more about Expo</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginBottom: 0,
  },
  qrButton: {
    backgroundColor: "#34C759",
    marginTop: 16,
    marginBottom: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loader: {
    marginTop: 8,
  },
  errorText: {
    color: "#D32F2F",
    marginTop: 8,
    marginBottom: 8,
  },
  qrCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  qrImage: {
    width: 220,
    height: 220,
    borderRadius: 10,
  },
});
