import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Image, Alert, Pressable } from "react-native";
import { login, getToken } from "@/services/auth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
        
      await login({ email, password });
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Fehler", e.message);
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
    <View className="flex-1 justify-center items-center p-4 bg-white">
      {/* Logo */}
      <View className="flex-row items-center mb-10">
        <Image
          source={require("@/assets/logo.png")}
          className="w-[100px] h-[100px] m-5"
        />
        <View>
          <Text className="text-7xl font-bold text-textmain">Käse</Text>
          <Text className="text-5xl font-bold text-textmain">mit Liebe</Text>
        </View>
      </View>

      {/* Inputs */}
      <TextInput
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        className="border border-olive_bright w-full p-3 mb-3 rounded"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-olive_bright w-full p-3 mb-6 rounded"
      />

      {/* Login button */}
      <Pressable
        onPress={handleLogin}
        className="bg-olive_bright w-full py-3 rounded mb-4"
      >
        <Text className="text-white text-center font-bold text-lg">Login</Text>
      </Pressable>

      {/* Link to Register */}
      <Pressable onPress={() => router.push("/register")}>
        <Text className="text-olive_bright underline">
          Noch kein Konto? Registrieren
        </Text>
      </Pressable>
    </View>
  );
}
