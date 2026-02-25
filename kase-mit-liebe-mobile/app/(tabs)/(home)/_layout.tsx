import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="cheese/index" />
      <Stack.Screen name="cheese/[id]" />
      <Stack.Screen name="cheese/edit/[id]" />
      <Stack.Screen name="cheese/new" />
      <Stack.Screen name="recipes/index" />
      <Stack.Screen name="recipes/[id]" />
      <Stack.Screen name="recipes/favorites" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}
