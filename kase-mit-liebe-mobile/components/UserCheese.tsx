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
      <View style={[styles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" color="#7A8F2A" />
      </View>
    );
  }

  if (batches.length === 0) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <Text style={styles.emptyText}>
          sie haben keine Käsecharge zu verfolgen.
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>Кäsereifungsplan</Text>

      <ScrollView style={{ height: heightContainer }}>
        <CheeseTimelineVertical groups={groups} onHide={hideFromTimeline}/>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    
    marginTop: 12,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
  },
});
