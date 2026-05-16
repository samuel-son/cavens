import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../src/theme/colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        initialRouteName="welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
