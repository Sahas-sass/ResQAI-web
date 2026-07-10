import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SystemDetailsHome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>ResQAI System</Text>
          <Text style={styles.tagline}>Intelligent Emergency Response</Text>
        </View>

        {/* About the System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="robot" size={20} color="#F54E4E" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>AI-Powered Dispatch</Text>
              <Text style={styles.cardDesc}>Our system analyzes your emergency instantly and routes the closest available responders to your exact location.</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="map-marker-alt" size={20} color="#F54E4E" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Precision Tracking</Text>
              <Text style={styles.cardDesc}>Watch help arrive in real-time. Live GPS tracking keeps you updated on responder proximity.</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="users" size={20} color="#F54E4E" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Community Network</Text>
              <Text style={styles.cardDesc}>Connects certified off-duty medics, volunteers, and official ambulances to create a faster safety net.</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions that mirror the Nav Bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#F54E4E' }]}
              onPress={() => router.push('/citizen/sos-form')}
            >
              <FontAwesome5 name="phone-alt" size={24} color="white" style={{ marginBottom: 10 }} />
              <Text style={styles.actionButtonText}>I Need Help</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#333333' }]}
              onPress={() => router.push('/responder/dashboard')}
            >
              <FontAwesome5 name="shield-alt" size={24} color="white" style={{ marginBottom: 10 }} />
              <Text style={styles.actionButtonText}>Responder</Text>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 25, paddingBottom: 100 },
  header: { marginTop: 20, marginBottom: 30 },
  welcomeText: { fontSize: 16, color: '#888888', textTransform: 'uppercase', letterSpacing: 1 },
  appName: { fontSize: 36, fontWeight: '900', color: '#111111', marginTop: 5 },
  tagline: { fontSize: 16, color: '#F54E4E', fontWeight: '600', marginTop: 5 },
  section: { marginBottom: 35 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111111', marginBottom: 15 },
  
  infoCard: { flexDirection: 'row', backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginBottom: 15, alignItems: 'center' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(245, 78, 78, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#666666', lineHeight: 18 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flex: 1, paddingVertical: 25, borderRadius: 16, alignItems: 'center', marginHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});