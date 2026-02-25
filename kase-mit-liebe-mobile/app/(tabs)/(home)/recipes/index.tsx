import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  TextInput,
  ScrollView,
  StyleSheet
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getRecipes, getCategories } from "@/services/cheese";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/theme";

export default function AllRecipesScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const currentScheme = colorScheme || "light";
  const colors = Colors[currentScheme];
  const isDark = currentScheme === "dark";

  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAging, setSelectedAging] = useState<string | null>(null); // 'short', 'medium', 'long'

  const fetchData = async () => {
    try {
      const [recipesData, categoriesData] = await Promise.all([
        getRecipes(),
        getCategories()
      ]);
      setRecipes(recipesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? recipe.category_id === selectedCategory : true;
    
    let matchesAging = true;
    if (selectedAging === 'short') matchesAging = recipe.aging <= 30;
    else if (selectedAging === 'medium') matchesAging = recipe.aging > 30 && recipe.aging <= 90;
    else if (selectedAging === 'long') matchesAging = recipe.aging > 90;

    return matchesSearch && matchesCategory && matchesAging;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/recipes/${item.id}`)}
      className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
    >
      {item.image ? (
        <Image source={{ uri: item.image }} className="w-full h-48" />
      ) : (
        <View className="w-full h-48 items-center justify-center bg-neutral-100 dark:bg-neutral-700">
          <MaterialCommunityIcons name="book-open-page-variant" size={60} color={isDark ? "#555" : "#ccc"} />
        </View>
      )}
      <View className="p-4">
        <Text className="text-xl font-bold mb-2 text-textmain dark:text-neutral-100">
          {item.name}
        </Text>
        
        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="tag-outline" size={16} color="#e29b03" />
            <Text className="ml-1 text-sm opacity-60 text-textmain dark:text-neutral-400">
              {item.recipes_categories?.name}
            </Text>
          </View>
          {item.aging && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#e29b03" />
              <Text className="ml-1 text-sm opacity-60 text-textmain dark:text-neutral-400">
                {item.aging} Tage
              </Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text 
            className="text-sm opacity-80 text-textmain dark:text-neutral-300" 
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}
      </View>
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
            Alle Rezepte
          </Text>
        </View>

        {/* Search Bar */}
        <View 
          className="flex-row items-center px-4 h-12 rounded-full border mb-4 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-2 text-textmain dark:text-neutral-100"
            placeholder="Rezept suchen..."
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

        {/* Categories Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          <TouchableOpacity 
            onPress={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full border ${!selectedCategory ? 'bg-olive_bright border-olive_bright' : (isDark ? 'border-neutral-700' : 'border-gray-300')}`}
          >
            <Text className={!selectedCategory ? 'text-white' : 'text-textmain dark:text-neutral-400'}>Alle</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full border ${selectedCategory === cat.id ? 'bg-olive_bright border-olive_bright' : (isDark ? 'border-neutral-700' : 'border-gray-300')}`}
            >
              <Text className={selectedCategory === cat.id ? 'text-white' : 'text-textmain dark:text-neutral-400'}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Aging Filter */}
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity 
            onPress={() => setSelectedAging(selectedAging === 'short' ? null : 'short')}
            className={`flex-1 py-2 rounded-lg border items-center ${selectedAging === 'short' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-400' : (isDark ? 'border-neutral-700' : 'border-gray-200')}`}
          >
            <Text className="text-xs" style={{ color: selectedAging === 'short' ? '#e29b03' : (isDark ? '#999' : '#666') }}>&lt; 30 Tage</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedAging(selectedAging === 'medium' ? null : 'medium')}
            className={`flex-1 py-2 rounded-lg border items-center ${selectedAging === 'medium' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-400' : (isDark ? 'border-neutral-700' : 'border-gray-200')}`}
          >
            <Text className="text-xs" style={{ color: selectedAging === 'medium' ? '#e29b03' : (isDark ? '#999' : '#666') }}>30-90 Tage</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedAging(selectedAging === 'long' ? null : 'long')}
            className={`flex-1 py-2 rounded-lg border items-center ${selectedAging === 'long' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-400' : (isDark ? 'border-neutral-700' : 'border-gray-200')}`}
          >
            <Text className="text-xs" style={{ color: selectedAging === 'long' ? '#e29b03' : (isDark ? '#999' : '#666') }}>&gt; 90 Tage</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#e29b03" />
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          className="px-5"
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <MaterialCommunityIcons name="book-off-outline" size={60} color={isDark ? "#444" : "#ccc"} />
              <Text className="text-lg opacity-60 mt-4 text-textmain dark:text-neutral-400">
                Keine Rezepte gefunden.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
