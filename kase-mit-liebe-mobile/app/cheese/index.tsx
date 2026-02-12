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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function CheeseBatchesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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
      className="flex-row p-4 mb-3 rounded-xl shadow-sm"
      style={{ backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e' }}
    >
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
        {item.image ? (
          <Image source={{ uri: item.image }} className="w-full h-full" />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <MaterialCommunityIcons name="cheese" size={40} color="#ccc" />
          </View>
        )}
      </View>
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-lg font-bold" style={{ color: colors.text }}>
          {item.recipeName}
        </Text>
        <Text className="text-sm opacity-60" style={{ color: colors.text }}>
          {item.recipeCategory}
        </Text>
        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons name="calendar" size={14} color={colors.text} style={{ opacity: 0.6 }} />
          <Text className="text-xs ml-1 opacity-60" style={{ color: colors.text }}>
            {dayjs(item.date).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-5 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Meine Käsechargen
          </Text>
        </View>

        <View 
          className="flex-row items-center px-4 h-12 rounded-full border"
          style={{ borderColor: "#ccc", backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#333' }}
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Nach Rezept suchen..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={{ color: colors.text }}
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-lg opacity-60" style={{ color: colors.text }}>
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
