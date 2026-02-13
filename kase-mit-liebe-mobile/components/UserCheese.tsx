import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Batch } from "@/types/global";
import { API_URL } from "@/constants/config";
import CheeseTimelineVertical from "@/components/timeLine/CheeseTimelineVertical";
import { groupBatchesByReadyMonth } from "@/components/timeLine/groupBatchesByReadyMonth"; 

interface UserCheeseProps {
  nickname: string;
  refreshKey?: number;
}

type TimelineBatch = {
  id: number;
  recipeName: string;
  createdAt: string;
  readyAt: string;
};

export default function UserCheese({ nickname, refreshKey }: UserCheeseProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nickname) return;

    const fetchBatches = async () => {
      try {
        const res = await fetch(`${API_URL}/cheese-batches/user/${nickname}`);
        const data: Batch[] = await res.json();
        setBatches(data);
      } catch (err) {
        console.error("Error fetching batches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [nickname, refreshKey]);

  const hideFromTimeline = async (id: number) => {
    try {
      await fetch(`${API_URL}/cheese-batches/${id}/timeline`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ onTimeLine: false }),
      });
  
      // оновлюємо локальний state
      setBatches((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, onTimeLine: false } : b
        )
      );
    } catch (err) {
      console.error("Error hiding batch from timeline:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#7A8F2A" />
      </View>
    );
  }

  if (batches.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">
          sie haben keine Käсеcharge zu verfolgen.
        </Text>
      </View>
    );
  }

  // Фільтруємо батчі, які мають дату визрівання
  const timelineBatches: TimelineBatch[] = batches
  .filter((b) => b.readyAt && b.onTimeLine)
  .map((b) => ({
    id: b.id,
    recipeName: b.recipeName,
    createdAt: b.createdAt,
    readyAt: b.readyAt!, // тут точно не null
  }));

  // Групуємо по місяцях
  const groups = groupBatchesByReadyMonth(timelineBatches);

  // Динамічна висота контейнера
  const heightContainer =
    timelineBatches.length*110

  return (
    <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
      <Text className="font-bold text-xl mt-3">Кäsereifungsplan</Text>

      <ScrollView style={{ height: heightContainer }}>
        <CheeseTimelineVertical groups={groups} onHide={hideFromTimeline}/>
      </ScrollView>
    </ScrollView>
  );
}
