import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/config";

type PublicBatch = {
  id: number;
  image: string;
  recipeName: string;
  user: {
    nickName: string;
  };
};

export default function PublicBatchesCarousel() {
  const [batches, setBatches] = useState<PublicBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/cheese-batches/publick`)
      .then((res) => res.json())
      .then((data: PublicBatch[]) => {
        // Беремо тільки перші 10 для каруселі
        setBatches(data.slice(0, 10));
      })
      .catch((err) => console.error("Error fetching public batches:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="mt-6 h-40 items-center justify-center">
        <ActivityIndicator color="#e29b03" size="large" />
      </View>
    );
  }

  if (batches.length === 0) {
    return null;
  }

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth * 0.6;

  return (
    <View className="mt-6">
      <Text className="font-bold text-2xl text-textmain px-6 h-12">
        Inspiration von anderen
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {batches.map((batch) => (
          <Pressable
            key={batch.id}
            onPress={() => router.push(`/cheese/${batch.id}`)}
            style={{ width: itemWidth, marginRight: 16 }}
          >
            <View className="relative">
              <Image
                source={{ uri: batch.image }}
                style={{
                  width: "100%",
                  aspectRatio: 4 / 3,
                  borderRadius: 12,
                  resizeMode: "cover",
                }}
              />
              <View className="absolute bottom-0 left-0 right-0 bg-black/40 p-2 rounded-b-xl">
                <Text className="text-white font-bold text-xs" numberOfLines={1}>
                  {batch.recipeName}
                </Text>
                <Text className="text-white/80 text-[10px]">
                  von {batch.user.nickName}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
