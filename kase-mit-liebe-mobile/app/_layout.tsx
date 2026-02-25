import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { getToken } from "@/services/auth";
import AppSplashScreen from "@/components/SplashScreen";
import { View } from "react-native";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useColorScheme();
  
  useEffect(() => {
    const checkAuth = async () => {
      // Internal auth check
      await getToken();
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <AppSplashScreen onFinish={() => setLoading(false)} />;
  } 

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor={colorScheme === 'dark' ? '#151718' : '#ffffff'}
        translucent={false}
      />
      <GestureHandlerRootView className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
