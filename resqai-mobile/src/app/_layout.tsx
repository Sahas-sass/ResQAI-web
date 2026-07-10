import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide nav bar on the splash screen
  const isSplashScreen = pathname === '/';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <Slot />
      </View>

      {!isSplashScreen && (
        <View style={styles.navBar}>
          
          {/* Main Informational Home */}
          <TouchableOpacity onPress={() => router.push('/home')} style={styles.navItem} activeOpacity={0.7}>
            <FontAwesome5 
              name="home" 
              size={22} 
              color={pathname === '/home' ? '#F54E4E' : '#666666'} 
            />
          </TouchableOpacity>

          {/* Citizen: SOS Input */}
          <TouchableOpacity onPress={() => router.push('/citizen/sos-form')} style={styles.navItem} activeOpacity={0.7}>
            <FontAwesome5 
              name="hand-holding-medical" 
              size={22} 
              color={pathname.includes('/citizen/sos-form') ? '#F54E4E' : '#666666'} 
            />
          </TouchableOpacity>

          {/* Citizen: Status */}
          <TouchableOpacity onPress={() => router.push('/citizen/sos-status')} style={styles.navItem} activeOpacity={0.7}>
            <FontAwesome5 
              name="info-circle" 
              size={22} 
              color={pathname.includes('/citizen/sos-status') ? '#F54E4E' : '#666666'} 
            />
          </TouchableOpacity>

          {/* Responder: Dashboard */}
          <TouchableOpacity onPress={() => router.push('/responder/dashboard')} style={styles.navItem} activeOpacity={0.7}>
            <FontAwesome5 
              name="user-shield" 
              size={22} 
              color={pathname.includes('/responder') ? '#F54E4E' : '#666666'} 
            />
          </TouchableOpacity>
          
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FAFCFF' // Matches the cool white of your premium screens
  },
  screenContainer: { 
    flex: 1 
  },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    backgroundColor: '#181A1F', // Deep, rich dark theme
    height: 85, // Slightly taller for a premium feel
    paddingBottom: 20, // Extra padding for the bottom safe area
    paddingTop: 10,
    borderTopLeftRadius: 25, // Curved edges
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20, // Strong upward shadow for Android
  },
  navItem: { 
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'center' 
  }
});