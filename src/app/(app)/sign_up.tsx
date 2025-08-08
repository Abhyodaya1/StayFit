import * as React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import Toast from "react-native-toast-message";
export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] =useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] =useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    if (!emailAddress || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both email and password.',
      });
      return;
    }
    setIsLoading(true)
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // Add toast.show here
      // If using a toast library like react-native-toast-message
      // (Make sure to import and configure it at the app root)
      // @ts-ignore
      if (typeof toast !== 'undefined' && toast.show) {
        Toast.show({
          type: 'error',
          text1: 'Sign Up Error',
          text2: (err && (err as any).errors && (err as any).errors[0]?.message) || 'An error occurred during sign up.',
        });
      }
      console.error(JSON.stringify(err, null, 2))
    }
    finally{
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return
    if (!code) {
        Toast.show({
          type: 'error',
          text1: 'Missing Code',
          text2: 'Please enter the verification code sent to your email.',
        });
      return;
    }
    setIsLoading(true);
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
    finally{
      setIsLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#93C5FD' ,  }}>
      <KeyboardAvoidingView
        style={{ flex: 1 , backgroundColor: '#93C5FD'}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 44 : 0} // Fixed: always a number
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <LinearGradient
            colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
            style={styles.container}
          >
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <FontAwesome6 name="envelope" size={48} color="#fff" style={{ marginBottom: 8 }} />
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>
            Check Your Email
          </Text>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' , marginTop:4}}>
            We've Sent An Verification Code to {'\n'} {emailAddress}
          </Text>
          </View>
          <View style={styles.content}>
            
              <Text style={{ color: '#1E3A8A', fontSize: 18, fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' }}>
                Enter Verification Code
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="key" size={24} color="#1E3A8A" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Verification Code"
                  placeholderTextColor="#93C5FD"
                  secureTextEntry
                  value={code}
                  onChangeText={(code) => setCode(code)}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity style={styles.signInButton} onPress={onVerifyPress}>
                <Text style={styles.signInButtonText}>
                  {isLoading? "Verifying....": "Verify Your Email"}</Text>
              </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 16, alignSelf: 'center' }}
              onPress={()=>{}}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={{ color: '#1E3A8A', fontWeight: 'bold', fontSize: 16 }}>
                Didn't receive OTP? <Text style={{ textDecorationLine: 'underline' }}>Send again</Text>
              </Text>
            </TouchableOpacity>
            </View>
        </LinearGradient>
    </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#93C5FD' ,  }}>
    <KeyboardAvoidingView
      style={{ flex: 1 , backgroundColor: '#93C5FD'}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 44 : 0} // Fixed: always a number
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
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
                Join The Revolution
              </Text>
          </View>
          <View style={styles.content}>
              <Text style={styles.title}>Welcome!</Text>
              <Text style={styles.subtitle}>Create Your Account</Text>

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
              {password.length > 0 && password.length <= 8 && (
                <Text style={{ color: 'red', marginBottom: 8, alignSelf: 'flex-start', marginLeft: 10 }}>
                  Password must be longer than 8 characters.
                </Text>
              )}

              <TouchableOpacity style={styles.signInButton} onPress={onSignUpPress}>
                <Text style={styles.signInButtonText}>Create Account</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <Text style={{ color: '#2563EB', marginHorizontal: 10, fontSize: 14, textAlign: 'center', marginTop: 10 }}>
                  By signing up, you agree to our Terms & Conditions.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 24, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  paddingVertical: 4,
                }}
                activeOpacity={0.8}
                onPress={() => {
                  router.push('/sign_in')
                }}
              >
                <Text style={{ color: '#2563EB', fontWeight: 'bold', fontSize: 16 }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
    </LinearGradient>
    </ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>
  )
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '500',
  },
})