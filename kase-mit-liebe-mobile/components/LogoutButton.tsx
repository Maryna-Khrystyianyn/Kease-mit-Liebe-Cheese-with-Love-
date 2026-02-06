import React from "react";
import { Pressable, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login"); // повернути на сторінку логіну
  };

  return (
    <Pressable
      onPress={handleLogout}
      className="bg-red-500 px-4 py-2 rounded mt-4"
    >
      <Text className="text-white text-center font-bold">Вийти</Text>
    </Pressable>
  );
}