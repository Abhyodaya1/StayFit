import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import Toast from "react-native-toast-message";

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both email and password.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Signed in successfully!',
        });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Toast.show({
          type: 'error',
          text1: 'Sign-in Failed',
          text2: 'Invalid email or password.',
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Sign-in Failed',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Signed in with Google successfully!',
        });
        router.replace('/(app)/(tabs)/workout');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign-in Incomplete',
          text2: 'Additional steps (e.g., MFA) may be required.',
        });
      }
    } catch (err) {
      console.error('Google Sign-In Error:', JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Sign-in Failed',
        text2: 'Failed to sign in with Google. Please try again.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }, [startSSOFlow, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#93C5FD' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 44 : 0}
      >
        <LinearGradient
          colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
          style={styles.container}
        >
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <FontAwesome6 name="heart-pulse" size={48} color="#fff" style={{ marginBottom: 8 }} />
            <Text
              style={{
                color: '#fff',
                fontSize: 24,
                fontWeight: 'bold',
                textShadowColor: 'rgba(0,0,0,0.4)',
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 4,
                marginBottom: 4,
              }}
            >
              StayFit
            </Text>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              Your Personal Fitness Guide
            </Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#1E3A8A" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={emailAddress}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                placeholderTextColor="#93C5FD"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#1E3A8A" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#93C5FD"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.signInButton, isLoading && { opacity: 0.7 }]}
              onPress={onSignInPress}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              onPress={handleGoogleSignIn}
              style={[styles.googleButton, isGoogleLoading && { opacity: 0.7 }]}
              activeOpacity={0.85}
              disabled={isGoogleLoading}
            >
              <Image
                source={require('../../../assets/images/google_logo.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>
                {isGoogleLoading ? 'Signing In...' : 'Sign in with Google'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 24, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              style={{
                borderRadius: 8,
                paddingVertical: 4,
              }}
              activeOpacity={0.8}
              onPress={() => {
                router.push('/sign_up');
              }}
            >
              <Text style={{ color: '#2563EB', fontWeight: 'bold', fontSize: 16 }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255,1)',
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
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // light grey
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#1E3A8A',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#93C5FD',
  },
  dividerText: {
    color: '#2563EB',
    marginHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  googleIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});