import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { getToken } from "@/services/auth";
import { jwtDecode } from "jwt-decode";

import HomeHeader from "@/components/HomeHeader";
import UserBatchesCarousel from "@/components/UserBatchesCarousel";
import PublicBatchesCarousel from "@/components/PublicBatchesCarousel";
import HomeCTA from "@/components/HomeCTA";
import CheeseRecommendations from "@/components/CheeseRecommendations";
import UserCheese from "@/components/UserCheese";
import { API_URL } from "@/constants/config";

interface TokenPayload {
  nick_name: string;
}

export default function HomeScreen() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [hasBatches, setHasBatches] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const t = await getToken();
      if (!t) {
        router.replace("/login");
        return;
      }
      setToken(t);
      try {
        const decoded = jwtDecode<TokenPayload>(t);
        setNickname(decoded.nick_name);
        checkUserBatches(decoded.nick_name);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    };

    checkAuth();
  }, []);

  // Check if the user has their own batches
  const checkUserBatches = async (name: string) => {
    try {
      const res = await fetch(`${API_URL}/user/${name}/batch-images`);
      const data = await res.json();
      setHasBatches(data.length > 0);
    } catch (err) {
      console.error("Error checking batches:", err);
      setHasBatches(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <HomeHeader />

      {/* Main content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {/* User batches carousel or public batches */}
        {nickname && hasBatches === true && (
          <UserBatchesCarousel nickname={nickname} refreshKey={0} />
        )}
        {nickname && hasBatches === false && <PublicBatchesCarousel />}

        {/* Main call-to-action */}
        {nickname && hasBatches === false && <HomeCTA />}

        {/* Cheese recommendations */}
        {nickname && hasBatches === false && <CheeseRecommendations />}

        {/* User cheese timeline */}
        {nickname && hasBatches === true && (
          <View className="mt-6">
            <UserCheese nickname={nickname} refreshKey={0} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
