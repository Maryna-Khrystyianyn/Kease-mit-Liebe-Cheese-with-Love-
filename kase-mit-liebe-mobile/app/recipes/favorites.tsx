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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function FavoriteRecipesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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
        className="mb-6 rounded-2xl overflow-hidden shadow-sm border"
        style={{ 
          backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e',
          borderColor: colorScheme === 'light' ? '#eee' : '#333'
        }}
      >
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} className="w-full h-48" />
        ) : (
          <View className="w-full h-48 items-center justify-center bg-gray-100">
            <MaterialCommunityIcons name="book-open-page-variant" size={60} color="#ccc" />
          </View>
        )}
        <View className="p-4">
          <Text className="text-xl font-bold mb-2" style={{ color: colors.text }}>
            {recipe.name}
          </Text>
          
          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="tag-outline" size={16} color="#e29b03" />
              <Text className="ml-1 text-sm opacity-60" style={{ color: colors.text }}>
                {recipe.recipes_categories?.name}
              </Text>
            </View>
            {recipe.aging && (
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="clock-outline" size={16} color="#e29b03" />
                <Text className="ml-1 text-sm opacity-60" style={{ color: colors.text }}>
                  {recipe.aging} Tage
                </Text>
              </View>
            )}
          </View>

          {recipe.description && (
            <Text 
              className="text-sm opacity-80" 
              numberOfLines={3}
              style={{ color: colors.text }}
            >
              {recipe.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-5 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
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
              <MaterialCommunityIcons name="heart-broken" size={60} color="#ccc" />
              <Text className="text-lg opacity-60 mt-4 text-center" style={{ color: colors.text }}>
                Du hast keine Lieblingsrezepte. 😢
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
