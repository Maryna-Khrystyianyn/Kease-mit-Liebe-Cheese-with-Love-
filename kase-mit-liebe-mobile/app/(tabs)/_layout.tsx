import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as SecureStore from "expo-secure-store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >

       {/* 🏠 Home */}
       <Tabs.Screen
        name="(home)"
        
        options={{
          title: "Home",
          headerShown: false, 
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      {/* Website */}
      <Tabs.Screen
        name="website"
        options={{
          title: "Website",
          headerShown: false, 
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="globe" color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // ❗ не відкриваємо екран
            Linking.openURL("https://kease-mit-liebe-cheese-with-love.vercel.app"); // 🔗 твій сайт
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          headerShown: false, 
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          ),
        }}
      />

      {/* 🚪 Logout */}
      <Tabs.Screen
        name="logout"
        options={{
          title: "Logout",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol
              size={28}
              name="rectangle.portrait.and.arrow.right"
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // ❗ не відкриваємо екран
            Alert.alert("Logout", "Möchtest du dich wirklich abmelden?", [
              { text: "Abbrechen", style: "cancel" },
              {
                text: "Logout",
                style: "destructive",
                onPress: handleLogout,
              },
            ]);
          },
        }}
      />
    </Tabs>
  );
}
