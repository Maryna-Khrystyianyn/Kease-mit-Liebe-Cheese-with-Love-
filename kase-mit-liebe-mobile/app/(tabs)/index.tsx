import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getToken } from "@/services/auth";
import { View, Image, Text } from "react-native";
import LogoutButton from "@/components/LogoutButton";

export default function HomeScreen() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const t = await getToken();
      if (!t)
        router.replace("/login"); // якщо токену немає, перекидаємо на логін
      else setToken(t);
    };
    checkAuth();
  }, []);
  return (
    <View>

 <View className="flex-row justify-center items-center gap-1 sm:gap-2 mt-10">
      <Image
        source={require("@/assets/logo.png")}
        className="w-[120px] h-[120px]"
      />
      <View>
        <Text className="font-bold leading-none text-7xl">Käse</Text>
        <Text className="text-4xl font-bold"> mit Liebe </Text>
      </View>

      <View className="flex-1 justify-center items-center p-4">
        {/* Якщо токен є, показуємо кнопку */}
        {token && <LogoutButton />}
      </View>
    </View>

    </View>
   
  );
}
