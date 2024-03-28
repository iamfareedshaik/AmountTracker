import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Assuming you have Expo installed
import { useToken } from "../app/context/TokenContext";
import { http } from "../Api";
const ProfileScreen = () => {
  const { eventListener } = useToken();
  const [mydetails, setmyDetails] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await http.get("/me");
      const data = response.data;
      setmyDetails(data.user);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => eventListener({ type: "onAuthLogout" }),
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/person.jpg")}
          style={styles.profileImage}
        />

        <Text style={styles.name}>{mydetails.name}</Text>
        <Text style={styles.email}>{mydetails.email}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.editProfileButton}>Profile Details</Text>
        <View style={styles.section}>
          <MaterialCommunityIcons name="phone" size={24} color="#555" />
          <Text style={styles.sectionText}>{mydetails.phone}</Text>
        </View>
        <View style={styles.section}>
          <MaterialCommunityIcons name="email" size={24} color="#555" />
          <Text style={styles.sectionText}>{mydetails.email}</Text>
        </View>
        {/* Add more profile details here */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    color: "#777",
    fontSize: 16,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  editProfileButton: {
    alignItems: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  logoutButton: {
    backgroundColor: "#FF4500", // Red color for the logout button
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
