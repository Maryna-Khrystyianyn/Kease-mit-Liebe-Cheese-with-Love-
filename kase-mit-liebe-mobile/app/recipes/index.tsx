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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function AllRecipesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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
      className="mb-6 rounded-2xl overflow-hidden shadow-sm border"
      style={{ 
        backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e',
        borderColor: colorScheme === 'light' ? '#eee' : '#333'
      }}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} className="w-full h-48" />
      ) : (
        <View className="w-full h-48 items-center justify-center bg-gray-100">
          <MaterialCommunityIcons name="book-open-page-variant" size={60} color="#ccc" />
        </View>
      )}
      <View className="p-4">
        <Text className="text-xl font-bold mb-2" style={{ color: colors.text }}>
          {item.name}
        </Text>
        
        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="tag-outline" size={16} color="#e29b03" />
            <Text className="ml-1 text-sm opacity-60" style={{ color: colors.text }}>
              {item.recipes_categories?.name}
            </Text>
          </View>
          {item.aging && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#e29b03" />
              <Text className="ml-1 text-sm opacity-60" style={{ color: colors.text }}>
                {item.aging} Tage
              </Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text 
            className="text-sm opacity-80" 
            numberOfLines={3}
            style={{ color: colors.text }}
          >
            {item.description}
          </Text>
        )}
      </View>
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
            Alle Rezepte
          </Text>
        </View>

        {/* Search Bar */}
        <View 
          className="flex-row items-center px-4 h-12 rounded-full border mb-4"
          style={{ borderColor: "#ccc", backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#333' }}
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Rezept suchen..."
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

        {/* Categories Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          <TouchableOpacity 
            onPress={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full border ${!selectedCategory ? 'bg-olive_bright border-olive_bright' : 'border-gray-300'}`}
          >
            <Text style={{ color: !selectedCategory ? '#fff' : colors.text }}>Alle</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full border ${selectedCategory === cat.id ? 'bg-olive_bright border-olive_bright' : 'border-gray-300'}`}
            >
              <Text style={{ color: selectedCategory === cat.id ? '#fff' : colors.text }}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Aging Filter */}
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity 
            onPress={() => setSelectedAging(selectedAging === 'short' ? null : 'short')}
            className={`flex-1 py-2 rounded-lg border items-center ${selectedAging === 'short' ? 'bg-orange-100 border-orange-400' : 'border-gray-200'}`}
          >
            <Text className="text-xs" style={{ color: selectedAging === 'short' ? '#e29b03' : colors.text }}>&lt; 30 Tage</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedAging(selectedAging === 'medium' ? null : 'medium')}
            className={`flex-1 py-2 rounded-lg border items-center ${selectedAging === 'medium' ? 'bg-orange-100 border-orange-400' : 'border-gray-200'}`}
          >
            <Text className="text-xs" style={{ color: selectedAging === 'medium' ? '#e29b03' : colors.text }}>30-90 Tage</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedAging(selectedAging === 'long' ? null : 'long')}
            className={`flex-1 py-2 rounded-lg border items-center ${selectedAging === 'long' ? 'bg-orange-100 border-orange-400' : 'border-gray-200'}`}
          >
            <Text className="text-xs" style={{ color: selectedAging === 'long' ? '#e29b03' : colors.text }}>&gt; 90 Tage</Text>
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View className="items-center mt-20">
              <MaterialCommunityIcons name="book-off-outline" size={60} color="#ccc" />
              <Text className="text-lg opacity-60 mt-4" style={{ color: colors.text }}>
                Keine Rezepte gefunden.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
