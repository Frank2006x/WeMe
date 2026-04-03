import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/auth-context";
import api from "@/constants/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profiles/me");
        setProfile(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setPhone(data.phone?.String || "");
        setEmail(data.email?.String || "");
        setWebsite(data.website?.String || "");
        setLinkedin(data.linkedin?.String || "");
        setGithub(data.github?.String || "");
        setTwitter(data.twitter?.String || "");
        setInstagram(data.instagram?.String || "");
      } catch (error) {
        // It's okay if it fails, means no profile exists yet
        console.log("No profile found, ready to create one.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      name,
      bio,
      phone,
      email,
      website,
      linkedin,
      github,
      twitter,
      instagram,
    };

    try {
      if (profile) {
        // Update existing profile
        await api.put("/profiles", payload);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        // Create new profile
        await api.post("/profiles", payload);
        Alert.alert("Success", "Profile created successfully!");
      }
      router.back();
    } catch (error: any) {
      const message = error.response?.data?.error || "An error occurred.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          {profile ? "Edit Profile" : "Create Profile"}
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Website"
          value={website}
          onChangeText={setWebsite}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="LinkedIn"
          value={linkedin}
          onChangeText={setLinkedin}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="GitHub"
          value={github}
          onChangeText={setGithub}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Twitter"
          value={twitter}
          onChangeText={setTwitter}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Instagram"
          value={instagram}
          onChangeText={setInstagram}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Profile"}
          </Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#000", // Adjust for theming
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
