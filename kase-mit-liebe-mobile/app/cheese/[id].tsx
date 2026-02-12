import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { getBatchDetails } from "@/services/cheese";
import { getMe } from "@/services/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { stripHtml } from "@/services/stripHtml";

export default function BatchDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [batch, setBatch] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchDetails = async () => {
        try {
          const [data, user] = await Promise.all([
            getBatchDetails(id as string),
            getMe()
          ]);
          setBatch(data);
          setCurrentUser(user);
        } catch (error) {
          console.error("Error fetching batch details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }, [id])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#e29b03" />
      </View>
    );
  }

  if (!batch) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Batch nicht gefunden.</Text>
      </View>
    );
  }

  const isOwner = currentUser && (currentUser.nick_name === batch.user_nick);

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="relative h-72">
        {batch.foto ? (
          <Image source={{ uri: batch.foto }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-gray-200">
            <MaterialCommunityIcons name="cheese" size={100} color="#ccc" />
          </View>
        )}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-12 left-5 w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        {isOwner && (
          <TouchableOpacity 
            onPress={() => router.push(`/cheese/edit/${batch.id}`)} 
            className="absolute top-12 right-5 px-4 h-10 rounded-full items-center justify-center flex-row"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            <Text className="text-white font-bold ml-1">Bearbeiten</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-5 py-6">
        <Text className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
          {batch.recipes.name} {dayjs(batch.date_batch).format("DD.MM.YYYY")} 
        </Text>
        <Text className="text-base opacity-60 mb-6" style={{ color: colors.text }}>
          {batch.recipes.recipes_categories.name}
        </Text>

        <View className="flex-row flex-wrap gap-4 mb-8">
          <InfoCard 
            icon="scale" 
            label="Gewicht" 
            value={`${batch.cheeseweight || 0} kg`} 
          />
          <InfoCard 
            icon="calendar-check" 
            label="Reifedatum" 
            value={batch.ready_at ? dayjs(batch.ready_at).format("DD.MM.YYYY") : "Nicht angegeben"} 
          />
        </View>

        <View className="mb-8">
          <Text className="text-lg font-bold mb-3 border-b pb-2" style={{ color: colors.text, borderColor: '#ccc' }}>
            Milch
          </Text>
          {batch.milk_in_batch.map((m: any, index: number) => (
            <View key={index} className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="water" size={18} color="#52814d" />
              <Text className="ml-2 text-base" style={{ color: colors.text }}>
                {m.ingredients.name}: <Text className="font-bold">{m.amount} L</Text>
              </Text>
            </View>
          ))}
        </View>

        {batch.description && (
          <View className="mb-8 ">
            <Text className="text-lg font-bold mb-3 border-b pb-2" style={{ color: colors.text, borderColor: '#ccc' }}>
              Beschreibung
            </Text>
            <RenderHTML
              contentWidth={Dimensions.get("window").width - 40}
              source={{ html: batch.description }}
              baseStyle={{ 
                color: colors.text, 
                fontSize: 16, 
                lineHeight: 24 
              }}
              tagsStyles={{
                p: { marginBottom: 10 },
                strong: { fontWeight: 'bold' }
              }}
            />
          </View>
        )}

        <View className="flex-row items-center pt-6 border-t" style={{ borderColor: '#ccc' }}>
          {batch.users.avatar && (
            <Image source={{ uri: batch.users.avatar }} className="w-10 h-10 rounded-full" />
          )}
          <Text className="ml-3 text-base font-bold" style={{ color: colors.text }}>
            {batch.users.username}
          </Text>
        </View>
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  
  return (
    <View 
      className="p-4 rounded-xl items-center justify-center flex-1 min-w-[45%]"
      style={{ backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#1c1c1e' }}
    >
      <MaterialCommunityIcons name={icon as any} size={24} color="#e29b03" />
      <Text className="text-xs opacity-60 mt-2 text-center" style={{ color: colors.text }}>
        {label}
      </Text>
      <Text className="text-sm font-bold mt-1 text-center" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
};
