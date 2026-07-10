import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SOSFormScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Refined Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Citizen Portal</Text>
          <Text style={styles.userName}>Emergency SOS</Text>
        </View>
        <TouchableOpacity style={styles.avatarPlaceholder}>
          <LinearGradient 
            colors={['#F5F7FA', '#E8ECF2']} 
            style={styles.avatarGradient}
          >
            <FontAwesome5 name="user-alt" size={18} color="#A0A0A0" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.title}>Having an Emergency?</Text>
        <Text style={styles.subtitle}>Press the button below and{'\n'}help will be dispatched instantly.</Text>

        {/* Enhanced Gradient Pulse Rings */}
        <View style={styles.pulseRingOuter}>
          <LinearGradient
            colors={['rgba(245, 78, 78, 0.05)', 'rgba(245, 78, 78, 0.15)']}
            style={styles.pulseRingOuterGradient}
          >
            <LinearGradient
              colors={['rgba(245, 78, 78, 0.15)', 'rgba(245, 78, 78, 0.3)']}
              style={styles.pulseRingInner}
            >
              {/* The Main SOS Button */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => router.push('/citizen/sos-status')}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#F54E4E', '#D93838']}
                  style={styles.sosButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name="hand-pointer" size={42} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFCFF' }, // Slightly cool white for contrast
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20 },
  welcomeText: { fontSize: 13, color: '#888888', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 },
  userName: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  avatarGradient: { flex: 1, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, marginTop: -40 },
  title: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#666666', textAlign: 'center', lineHeight: 24, marginBottom: 60 },
  
  pulseRingOuter: { width: 300, height: 300, borderRadius: 150, alignItems: 'center', justifyContent: 'center' },
  pulseRingOuterGradient: { width: 300, height: 300, borderRadius: 150, alignItems: 'center', justifyContent: 'center' },
  pulseRingInner: { width: 230, height: 230, borderRadius: 115, alignItems: 'center', justifyContent: 'center' },
  
  sosButton: { width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center', shadowColor: '#F54E4E', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 25, elevation: 15 },
});