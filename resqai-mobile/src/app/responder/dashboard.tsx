import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResponderDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Responder Hub</Text>
        <View style={styles.iconWrapper}>
          <FontAwesome5 name="bell" size={20} color="#F54E4E" />
          <View style={styles.notificationDot} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Sleek CTA Banner */}
        <LinearGradient 
          colors={['#232526', '#414345']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.registerBanner}
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Become a Responder</Text>
            <Text style={styles.bannerSubtitle}>Get verified status and start saving lives in your local network.</Text>
          </View>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/responder/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register</Text>
            <FontAwesome5 name="arrow-right" size={12} color="#111111" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Emergencies</Text>
          <Text style={styles.sectionSubtitle}>Scanning your 5-mile radius</Text>
        </View>

        {/* Floating Glass-like Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={styles.pulseIconContainer}>
                <FontAwesome5 name="heartbeat" size={14} color="#F54E4E" />
              </View>
              <Text style={styles.cardTitle}>Medical Emergency</Text>
            </View>
            <Text style={styles.cardTime}>Just now</Text>
          </View>
          
          <Text style={styles.cardLocation}>1.2 miles away • Citizen SOS</Text>
          
          <TouchableOpacity style={styles.acceptButton} activeOpacity={0.7}>
            <LinearGradient 
              colors={['rgba(245, 78, 78, 0.1)', 'rgba(245, 78, 78, 0.02)']}
              style={styles.acceptGradient}
            >
              <Text style={styles.acceptButtonText}>Accept & Route</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' }, // Cool grey/blue background
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, backgroundColor: 'transparent' },
  title: { fontSize: 26, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  iconWrapper: { position: 'relative', width: 45, height: 45, backgroundColor: 'white', borderRadius: 22.5, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  notificationDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, backgroundColor: '#F54E4E', borderRadius: 4, borderWidth: 1, borderColor: 'white' },
  
  /* Banner Styles */
  registerBanner: { marginHorizontal: 20, marginTop: 5, padding: 25, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  bannerTextContainer: { marginBottom: 20 },
  bannerTitle: { color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22 },
  registerButton: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, alignSelf: 'flex-start', paddingHorizontal: 25 },
  registerButtonText: { color: '#111111', fontWeight: '800', fontSize: 14, marginRight: 8 },

  /* Section Headers */
  sectionHeader: { paddingHorizontal: 25, marginTop: 25, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  sectionSubtitle: { fontSize: 13, color: '#888888', marginTop: 3 },

  /* Floating Card Styles */
  card: { backgroundColor: '#FFFFFF', marginHorizontal: 20, marginTop: 10, padding: 20, borderRadius: 20, shadowColor: '#8898AA', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  pulseIconContainer: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(245, 78, 78, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  cardTime: { fontSize: 13, color: '#F54E4E', fontWeight: '800' },
  cardLocation: { fontSize: 14, color: '#666666', marginBottom: 20, paddingLeft: 40 },
  
  acceptButton: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(245, 78, 78, 0.2)' },
  acceptGradient: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  acceptButtonText: { color: '#F54E4E', fontWeight: '800', fontSize: 15 }
});