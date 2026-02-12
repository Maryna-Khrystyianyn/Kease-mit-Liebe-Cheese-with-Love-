import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  Dimensions,
  FlatList
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  getRecipeDetails, 
  toggleFavorite, 
  checkIsFavorite,
  getPublicBatchesByRecipe 
} from "@/services/cheese";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import RenderHTML from "react-native-render-html";
import dayjs from "dayjs";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [recipe, setRecipe] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedBatches, setRelatedBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeData, favoriteStatus, batches] = await Promise.all([
          getRecipeDetails(id as string),
          checkIsFavorite(Number(id)),
          getPublicBatchesByRecipe(Number(id))
        ]);
        setRecipe(recipeData);
        setIsFavorite(favoriteStatus.favorite);
        setRelatedBatches(batches);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      const res = await toggleFavorite(Number(id));
      setIsFavorite(res.favorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#e29b03" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Rezept nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="relative h-80">
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-gray-200">
            <MaterialCommunityIcons name="book-open-page-variant" size={100} color="#ccc" />
          </View>
        )}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-12 left-5 w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleToggleFavorite}
          className="absolute top-12 right-5 w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          disabled={toggling}
        >
          {toggling ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialCommunityIcons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#e29b03" : "#fff"} 
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="px-5 py-6">
        <Text className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
          {recipe.name}
        </Text>
        
        <View className="flex-row items-center mb-6">
          <View className="bg-olive_bright px-3 py-1 rounded-full mr-3">
            <Text className="text-white text-xs font-bold">{recipe.recipes_categories?.name}</Text>
          </View>
          {recipe.aging && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#e29b03" />
              <Text className="ml-1 text-sm opacity-60" style={{ color: colors.text }}>
                {recipe.aging} Tage Reifezeit
              </Text>
            </View>
          )}
        </View>

        {/* Ingredients section */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-4 border-b pb-2" style={{ color: colors.text, borderColor: '#ccc' }}>
            Zutaten
          </Text>
          {recipe.recipe_ingredients?.map((ri: any, index: number) => (
            <View key={index} className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="circle-small" size={20} color="#52814d" />
              <Text className="ml-1 text-base flex-1" style={{ color: colors.text }}>
                {ri.ingredients?.name}
              </Text>
              <Text className="font-bold text-base" style={{ color: colors.text }}>
                {ri.amount} {ri.ingredients?.unit || "L"}
              </Text>
            </View>
          ))}
        </View>

        {/* Description / Steps section */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-4 border-b pb-2" style={{ color: colors.text, borderColor: '#ccc' }}>
            Zubereitung
          </Text>
          {recipe.body ? (
            <RenderHTML
              contentWidth={Dimensions.get("window").width - 40}
              source={{ html: recipe.body }}
              baseStyle={{ 
                color: colors.text, 
                fontSize: 16, 
                lineHeight: 24 
              }}
            />
          ) : (
            <Text className="text-base opacity-60" style={{ color: colors.text }}>
              Keine Zubereitungsschritte angegeben.
            </Text>
          )}
        </View>

        {/* Related Batches carousel */}
        {relatedBatches.length > 0 && (
          <View className="mb-8">
            <Text className="text-lg font-bold mb-4 border-b pb-2" style={{ color: colors.text, borderColor: '#ccc' }}>
              Hergestellte Chargen
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={relatedBatches}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => router.push(`/cheese/${item.id}`)}
                  className="mr-4 w-40 rounded-xl overflow-hidden"
                  style={{ backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#1c1c1e' }}
                >
                  {item.image ? (
                    <Image source={{ uri: item.image }} className="w-full h-32" />
                  ) : (
                    <View className="w-full h-32 items-center justify-center bg-gray-200">
                      <MaterialCommunityIcons name="cheese" size={40} color="#ccc" />
                    </View>
                  )}
                  <View className="p-2">
                    <Text className="text-xs font-bold" numberOfLines={1} style={{ color: colors.text }}>
                      {dayjs(item.date).format("DD.MM.YYYY")}
                    </Text>
                    <Text className="text-[10px] opacity-60" style={{ color: colors.text }}>
                      von {item.user?.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}
