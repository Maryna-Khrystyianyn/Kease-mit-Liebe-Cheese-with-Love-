import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/config";

type Batch = {
  id: number;
  foto: string;
  ispublic: boolean; // для внутрішнього використання, можна не відображати
};

interface Props {
  nickname: string;
  refreshKey?: number;
}

export default function UserBatchesCarousel({ nickname, refreshKey }: Props) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!nickname) return;

    // Додаємо timestamp щоб уникнути кешування якщо картинка змінилася за тією ж адресою
    fetch(`${API_URL}/user/${nickname}/batch-images?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data: Batch[]) => setBatches(data))
      .catch((err) => console.error("Error fetching batches:", err));
  }, [nickname, refreshKey]);

  if (batches.length === 0) {
    return null; // або можна показати заглушку
  }

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth * 0.6; // ширина однієї картки

  return (
    <View className="mt-6">
      <Text className="font-bold text-2xl text-textmain px-6 h-12">
        Meine Käsechargen
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
            style={{ width: itemWidth }}
            className="mr-4"
          >
            <Image
              source={{ uri: batch.foto }}
              className="w-full aspect-[4/3] rounded-xl"
              style={{ resizeMode: "cover" }}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
