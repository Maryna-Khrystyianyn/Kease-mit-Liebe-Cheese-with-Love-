import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  StyleSheet
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getMe } from "@/services/auth";
import { getUserBatches } from "@/services/cheese";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/theme";

export default function CheeseBatchesScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const currentScheme = colorScheme || "light";
  const colors = Colors[currentScheme];
  const isDark = currentScheme === "dark";

  const [nickname, setNickname] = useState<string | null>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchBatches = async (pageNum: number, searchTerm: string, isRefresh = false) => {
    if (!nickname) return;
    try {
      if (pageNum === 1 && !isRefresh) setLoading(true);
      const res = await getUserBatches(nickname, pageNum, searchTerm);
      if (pageNum === 1) {
        setBatches(res.data);
      } else {
        setBatches(prev => [...prev, ...res.data]);
      }
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const user = await getMe();
      if (user) {
        setNickname(user.nick_name);
      }
    };
    init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (nickname) {
        fetchBatches(1, search);
      }
    }, [nickname, search])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchBatches(1, search, true);
  };

  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBatches(nextPage, search);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/cheese/${item.id}`)}
      className="flex-row p-4 mb-3 rounded-xl shadow-sm bg-white dark:bg-neutral-800"
    >
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-neutral-700">
        {item.image ? (
          <Image source={{ uri: item.image }} className="w-full h-full" />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <MaterialCommunityIcons name="cheese" size={40} color={isDark ? "#555" : "#ccc"} />
          </View>
        )}
      </View>
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-lg font-bold text-textmain dark:text-neutral-100">
          {item.recipeName}
        </Text>
        <Text className="text-sm opacity-60 text-textmain dark:text-neutral-400">
          {item.recipeCategory}
        </Text>
        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons name="calendar" size={14} color={isDark ? "#999" : "#666"} />
          <Text className="text-xs ml-1 opacity-60 text-textmain dark:text-neutral-400">
            {dayjs(item.date).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <View className="px-5 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-textmain dark:text-neutral-100">
            Meine Käsechargen
          </Text>
        </View>

        <View 
          className="flex-row items-center px-4 h-12 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-2 text-textmain dark:text-neutral-100"
            placeholder="Nach Rezept suchen..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#e29b03" />
        </View>
      ) : (
        <FlatList
          data={batches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          className="px-5"
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-lg opacity-60 text-textmain dark:text-neutral-400">
                Keine Chargen gefunden.
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#e29b03" className="my-4" />
            ) : null
          }
        />
      )}
    </View>
  );
}
