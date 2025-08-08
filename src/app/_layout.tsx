import "../global.css";
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot, Stack, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <ClerkProvider>
      <Slot />
      <Toast />
    </ClerkProvider>
  );
}
