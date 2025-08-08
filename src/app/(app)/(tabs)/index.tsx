import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Modal, Platform, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '@clerk/clerk-expo';

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signed out successfully!',
      });
      console.log('Navigating to /(app)/sign_in after sign-out');
      router.replace('/(app)/sign_in');
    } catch (err) {
      console.error('Sign-Out Error:', JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Sign-out Failed',
        text2: 'An error occurred. Please try again.',
      });
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#93C5FD' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome6 name="heart-pulse" size={48} color="#fff" style={{ marginBottom: 8 }} />
            <Text
              style={{
                color: '#fff',
                fontSize: 24,
                fontWeight: 'bold',
                textShadowColor: 'rgba(0,0,0,0.4)',
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 4,
              }}
            >
              StayFit
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <FontAwesome6 name="user" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to StayFit</Text>
            <Text style={styles.subtitle}>Your journey to fitness starts here!</Text>
            <Text style={styles.description}>
              Explore workouts, track your progress, and stay motivated with StayFit.
            </Text>
          </View>
        </ScrollView>

        {/* Modal for Sign Out */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSignOut}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Sign Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#F3F4F6' }]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: '#2563EB' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 30,
    paddingBottom: 10,
  },
  profileButton: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 10 : 30,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#2563EB',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});