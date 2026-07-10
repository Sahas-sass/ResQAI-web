import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ResQAI</Text>
          <Text style={styles.subtitle}>An Emergency Hotline App</Text>
        </View>

        <View style={styles.graphicContainer}>
          <FontAwesome5 name="ambulance" size={100} color="white" />
          <View style={styles.speedLine1} />
          <View style={styles.speedLine2} />
          <View style={styles.speedLine3} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/home")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F54E4E" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  header: { alignItems: "center" },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "white",
    fontStyle: "italic",
    letterSpacing: -1,
  },
  subtitle: { fontSize: 16, color: "#FFE0E0", marginTop: 5, fontWeight: "500" },
  graphicContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 150,
    width: "100%",
  },
  speedLine1: {
    position: "absolute",
    left: 40,
    top: 50,
    width: 30,
    height: 4,
    backgroundColor: "white",
    borderRadius: 2,
    opacity: 0.7,
  },
  speedLine2: {
    position: "absolute",
    left: 20,
    top: 80,
    width: 50,
    height: 4,
    backgroundColor: "white",
    borderRadius: 2,
    opacity: 0.7,
  },
  speedLine3: {
    position: "absolute",
    left: 50,
    top: 110,
    width: 20,
    height: 4,
    backgroundColor: "white",
    borderRadius: 2,
    opacity: 0.7,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 18,
    width: "80%",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#F54E4E",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 1,
  },
});
