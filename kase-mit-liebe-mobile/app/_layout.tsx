import React, { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { getToken } from "@/services/auth";
import SplashScreen from "@/components/SplashScreen";

import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) setLoggedIn(true);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  } 

  return (
    <>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor={colors.background}
        translucent={false}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="cheese/index" />
          <Stack.Screen name="cheese/[id]" />
          <Stack.Screen name="cheese/edit/[id]" />
        </Stack>
      </GestureHandlerRootView>
   </>
  );
}
