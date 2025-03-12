import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const KYCStatusScreen = () => {
  const [kycStatus, setKycStatus] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get("https://your-api.com/api/kyc/status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { status, documentImage, selfieImage } = response.data;
      setKycStatus(status);
      setDocumentImage(documentImage);
      setSelfieImage(selfieImage);
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Verification Status</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Text style={styles.statusText}>
            Status:{" "}
            <Text
              style={[
                styles.status,
                kycStatus === "verified" ? styles.verified : kycStatus === "pending" ? styles.pending : styles.rejected,
              ]}
            >
              {kycStatus.toUpperCase()}
            </Text>
          </Text>

          {/* Show Document and Selfie Images */}
          {documentImage && (
            <Image source={{ uri: documentImage }} style={styles.kycImage} />
          )}
          {selfieImage && (
            <Image source={{ uri: selfieImage }} style={styles.kycImage} />
          )}

          {/* If KYC is rejected, allow user to re-upload */}
          {kycStatus === "rejected" && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.navigate("KYCUpdate")}
            >
              <Text style={styles.retryButtonText}>Re-upload KYC Documents</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 10,
  },
  status: {
    fontWeight: "bold",
  },
  verified: {
    color: "green",
  },
  pending: {
    color: "orange",
  },
  rejected: {
    color: "red",
  },
  kycImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default KYCStatusScreen;
