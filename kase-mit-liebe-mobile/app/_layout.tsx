// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { getToken } from "@/services/auth";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) setLoggedIn(true);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null; // або Splash Screen

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        {loggedIn ? (
          <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}
      </Stack>
    </>
  );
}
