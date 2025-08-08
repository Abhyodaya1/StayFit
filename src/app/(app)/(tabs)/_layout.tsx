import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'

export default function _layout() {
  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#1E3A8A', // solid background
        borderTopWidth: 0, 
        paddingTop:4// removes border line
      },
      tabBarActiveTintColor: '#fff', // active icon/text color
      tabBarInactiveTintColor: '#999', // inactive icon/text color
    }}
    >
        <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
           <AntDesign name="home" color={color}size={size} />
          ),
        }}
        />
         <Tabs.Screen
        name="workout"
        options={{
          headerShown: false,
          title: "WorkOut",
          tabBarIcon: ({ color, size }) => (
           <AntDesign name="pluscircle" color={color}size={size} />
          ),
        }}
        />
         <Tabs.Screen
        name="active-workout"
        options={{
          headerShown: false,
          title: "Active Workout",
          href: null,
          tabBarStyle: {
            display: "none",
          },
        }}
        />
         <Tabs.Screen
        name="exercises"
        options={{
          headerShown: false,
          title: "Exercises",
          tabBarIcon: ({ color, size }) => (
           <AntDesign name="book" color={color}size={size} />
          ),
        }}
        />
         <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ color, size }) => (
           <AntDesign name="clockcircle" color={color}size={size} />
          ),
        }}
        /> 
    </Tabs>
  )
}

