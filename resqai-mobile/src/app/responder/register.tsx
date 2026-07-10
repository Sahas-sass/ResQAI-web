import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ResponderRegister() {
  const router = useRouter();
  
  // Basic state for the form UI (you will connect this to a backend later)
  const [role, setRole] = useState('EMT'); 

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="user-md" size={32} color="#F54E4E" />
            </View>
            <Text style={styles.title}>Responder Onboarding</Text>
            <Text style={styles.subtitle}>Join the ResQAI network to receive emergency alerts in your area.</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. Dr. Sarah Jenkins"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="(555) 000-0000"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medical License / ID</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Certification Number"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            {/* Role Selection Tabs */}
            <Text style={styles.label}>Primary Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'EMT' && styles.roleButtonActive]}
                onPress={() => setRole('EMT')}
              >
                <Text style={[styles.roleText, role === 'EMT' && styles.roleTextActive]}>EMT / Paramedic</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.roleButton, role === 'Doctor' && styles.roleButtonActive]}
                onPress={() => setRole('Doctor')}
              >
                <Text style={[styles.roleText, role === 'Doctor' && styles.roleTextActive]}>Off-Duty Doctor</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => router.push('/responder/dashboard')}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 25, paddingBottom: 100 },
  header: { alignItems: 'center', marginTop: 10, marginBottom: 35 },
  iconContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(245, 78, 78, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  title: { fontSize: 26, fontWeight: '900', color: '#111111', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888888', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  
  form: { marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333333', marginBottom: 8 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 12, padding: 16, fontSize: 16, color: '#111111' },
  
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  roleButton: { flex: 1, paddingVertical: 14, backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  roleButtonActive: { backgroundColor: 'rgba(245, 78, 78, 0.1)', borderColor: '#F54E4E' },
  roleText: { color: '#888888', fontWeight: 'bold', fontSize: 14 },
  roleTextActive: { color: '#F54E4E' },

  submitButton: { backgroundColor: '#111111', paddingVertical: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});