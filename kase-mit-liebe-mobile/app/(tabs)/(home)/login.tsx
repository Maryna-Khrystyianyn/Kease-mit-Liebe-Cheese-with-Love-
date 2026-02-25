import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Image, Alert, Pressable } from "react-native";
import { login, getToken } from "@/services/auth";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await login({ email, password });
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Fehler", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) router.replace("/");
    };
    checkAuth();
  }, []);

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white dark:bg-neutral-900">
      {/* Logo */}
      <View className="flex-row items-center mb-10">
        <Image
          source={require("@/assets/logo.png")}
          className="w-[100px] h-[100px] m-5"
        />
        <View>
          <Text className="text-7xl font-bold text-textmain dark:text-neutral-100">Käse</Text>
          <Text className="text-5xl font-bold text-textmain dark:text-neutral-100">mit Liebe</Text>
        </View>
      </View>

      {/* Inputs */}
      <TextInput
        placeholder="E-Mail"
        placeholderTextColor={isDark ? "#999" : "#666"}
        value={email}
        onChangeText={setEmail}
        className="border border-olive_bright w-full p-3 mb-3 rounded text-textmain dark:text-neutral-100 bg-transparent dark:bg-neutral-800"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Passwort"
        placeholderTextColor={isDark ? "#999" : "#666"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-olive_bright w-full p-3 mb-6 rounded text-textmain dark:text-neutral-100 bg-transparent dark:bg-neutral-800"
      />

      {/* Login button */}
      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className={`bg-olive_bright w-full py-3 rounded mb-4 active:opacity-80 ${loading ? 'opacity-50' : ''}`}
      >
        <Text className="text-white text-center font-bold text-lg">Login</Text>
      </Pressable>

      {/* Link to Register */}
      <Pressable onPress={() => router.push("/register")} disabled={loading}>
        <Text className="text-olive_bright underline font-medium">
          Noch kein Konto? Registrieren
        </Text>
      </Pressable>

      <LoadingOverlay visible={loading} />
    </View>
  );
}
