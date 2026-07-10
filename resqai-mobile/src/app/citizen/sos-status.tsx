import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SOSStatusScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="ambulance" size={60} color="#F54E4E" />
        </View>
        <Text style={styles.title}>Help is on the way</Text>
        <Text style={styles.subtitle}>Responders have been notified of your location. Please stay calm.</Text>
        
        <ActivityIndicator size="large" color="#F54E4E" style={{ marginTop: 40 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(245, 78, 78, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111111', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#888888', textAlign: 'center', lineHeight: 24 },
});