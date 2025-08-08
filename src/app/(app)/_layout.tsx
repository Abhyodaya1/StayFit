import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const _layout = () => {
  
  const { isLoaded, userID, sessionId, GetToken} = useAuth
  const isSignedIn = false;
  return  (
  <Stack >
    <Stack.Protected guard={isSignedIn} >
   <Stack.Screen name="(tabs)"
     options={{headerShown: false}} />
     </Stack.Protected>
     <Stack.Protected guard={!isSignedIn}>
     <Stack.Screen
       name="sign-in"
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="sign-up"
       options={{ headerShown: false }}
     />
     </Stack.Protected>
  </Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})