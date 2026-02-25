import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getFavoriteRecipes } from "@/services/cheese";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/theme";

export default function FavoriteRecipesScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const currentScheme = colorScheme || "light";
  const colors = Colors[currentScheme];
  const isDark = currentScheme === "dark";

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const data = await getFavoriteRecipes();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const renderItem = ({ item }: { item: any }) => {
    const recipe = item.recipes;
    if (!recipe) return null;

    return (
      <TouchableOpacity 
        onPress={() => router.push(`/recipes/${recipe.id}`)}
        className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
      >
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} className="w-full h-48" />
        ) : (
          <View className="w-full h-48 items-center justify-center bg-neutral-100 dark:bg-neutral-700">
            <MaterialCommunityIcons name="book-open-page-variant" size={60} color={isDark ? "#555" : "#ccc"} />
          </View>
        )}
        <View className="p-4">
          <Text className="text-xl font-bold mb-2 text-textmain dark:text-neutral-100">
            {recipe.name}
          </Text>
          
          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="tag-outline" size={16} color="#e29b03" />
              <Text className="ml-1 text-sm opacity-60 text-textmain dark:text-neutral-400">
                {recipe.recipes_categories?.name}
              </Text>
            </View>
            {recipe.aging && (
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="clock-outline" size={16} color="#e29b03" />
                <Text className="ml-1 text-sm opacity-60 text-textmain dark:text-neutral-400">
                  {recipe.aging} Tage
                </Text>
              </View>
            )}
          </View>

          {recipe.description && (
            <Text 
              className="text-sm opacity-80 text-textmain dark:text-neutral-300" 
              numberOfLines={3}
            >
              {recipe.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <View className="px-5 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-textmain dark:text-neutral-100">
            Lieblings Rezepte
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#e29b03" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.recipe_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <MaterialCommunityIcons name="heart-broken" size={60} color={isDark ? "#444" : "#ccc"} />
              <Text className="text-lg opacity-60 mt-4 text-center text-textmain dark:text-neutral-400">
                Du hast keine Lieblingsrezepte. 😢
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
