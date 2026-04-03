import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
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
  const router = useRouter();
  const { logout } = useAuth();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/profiles/me");
      setProfile(data);
    } catch (error) {
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
