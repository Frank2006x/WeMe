import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import api from "@/constants/api";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

type ScannedProfile = {
  id: string;
  name: string;
  bio?: { String?: string } | string;
  email?: { String?: string } | string;
  phone?: { String?: string } | string;
};

function readNullableText(value?: { String?: string } | string) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.String ?? "";
}

function extractQrToken(raw: string) {
  if (!raw) return "";

  if (raw.includes("/qr/")) {
    const tokenFromPath = raw.split("/qr/")[1]?.split(/[?#]/)[0]?.trim();
    if (tokenFromPath) return tokenFromPath;
  }

  const simpleToken = raw.trim();
  return simpleToken;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanResult, setScanResult] = useState<ScannedProfile | null>(null);

  const openCamera = async () => {
    if (Platform.OS === "web") {
      setScanError("Camera scanning is available on Android and iOS.");
      return;
    }

    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        setScanError("Camera permission is required to scan QR codes.");
        return;
      }
    }

    setScanError("");
    setScanResult(null);
    setShowCamera(true);
  };

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (isBusy) return;

    const token = extractQrToken(data);
    if (!token) {
      setScanError("Invalid QR code. Please scan a valid WeMe code.");
      return;
    }

    setIsBusy(true);
    setScanError("");

    try {
      const response = await api.get(`/qr/${token}`);
      setScanResult(response.data);
      setShowCamera(false);
    } catch {
      setScanError("Scan failed. The QR token may be invalid or expired.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="qrcode.viewfinder"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Scan
        </ThemedText>
      </ThemedView>

      <ThemedText>Scan a WeMe QR code to view the shared profile.</ThemedText>

      {!showCamera && (
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <ThemedText style={styles.buttonText}>Open Camera</ThemedText>
        </TouchableOpacity>
      )}

      {showCamera && (
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setShowCamera(false)}
          >
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {isBusy && <ActivityIndicator size="large" />}

      {!!scanError && (
        <ThemedText style={styles.errorText}>{scanError}</ThemedText>
      )}

      {scanResult && (
        <ThemedView style={styles.resultCard}>
          <ThemedText type="subtitle">Scanned Profile</ThemedText>
          <ThemedText>Name: {scanResult.name || "N/A"}</ThemedText>
          {!!readNullableText(scanResult.email) && (
            <ThemedText>Email: {readNullableText(scanResult.email)}</ThemedText>
          )}
          {!!readNullableText(scanResult.phone) && (
            <ThemedText>Phone: {readNullableText(scanResult.phone)}</ThemedText>
          )}
          {!!readNullableText(scanResult.bio) && (
            <ThemedText>Bio: {readNullableText(scanResult.bio)}</ThemedText>
          )}
        </ThemedView>
      )}
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
  cameraWrapper: {
    marginTop: 16,
    gap: 12,
  },
  camera: {
    width: "100%",
    height: 320,
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#0A84FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
    marginTop: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#D32F2F",
    marginTop: 12,
  },
  resultCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
});
