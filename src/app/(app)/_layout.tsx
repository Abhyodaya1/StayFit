import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const _layout = () => {
  
  const { isLoaded, userID, sessionId, isSignedIn, GetToken} = useAuth();
  const router = useRouter();
  return  (
  <Stack >
    <Stack.Protected guard={!isSignedIn} >
   <Stack.Screen name="(tabs)"
     options={{headerShown: false}} />
     </Stack.Protected>
     <Stack.Protected guard={isSignedIn}>
     <Stack.Screen
       name="sign_in"
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="sign_up"
       options={{ headerShown: false }}
     />
     </Stack.Protected>
  </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})