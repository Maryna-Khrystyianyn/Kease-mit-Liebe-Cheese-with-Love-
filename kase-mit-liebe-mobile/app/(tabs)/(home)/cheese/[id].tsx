import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  Alert
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { getBatchDetails, reportContent } from "@/services/cheese";
import { getMe } from "@/services/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/theme";

export default function BatchDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const currentScheme = colorScheme || "light";
  const colors = Colors[currentScheme];

  const [batch, setBatch] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const handleReport = () => {
    setReportModalVisible(true);
  };

  const submitReport = async (reason: string) => {
    setReportModalVisible(false);
    try {
      await reportContent(id as string, "batch", reason);
      Alert.alert("Gemeldet", "Vielen Dank. Wir werden diesen Inhalt innerhalb von 24 Stunden prüfen.");
    } catch (error: any) {
      Alert.alert("Fehler", "Fehler beim Senden der Meldung.");
    }
  };

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
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#e29b03" />
      </View>
    );
  }

  if (!batch) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <Text className="text-textmain dark:text-neutral-100">Batch nicht gefunden.</Text>
      </View>
    );
  }

  const isOwner = currentUser && (currentUser.nick_name === batch.user_nick);

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
    <ScrollView className="flex-1">
      <View className="relative h-72">
        {batch.foto ? (
          <Image source={{ uri: batch.foto }} className="w-full h-full resize-cover" />
        ) : (
          <View className="w-full h-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <MaterialCommunityIcons name="cheese" size={100} color="#ccc" />
          </View>
        )}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-12 left-5 w-10 h-10 rounded-full items-center justify-center bg-black/50"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        {isOwner && (
          <TouchableOpacity 
            onPress={() => router.push(`/cheese/edit/${batch.id}`)} 
            className="absolute top-12 right-5 px-4 h-10 rounded-full items-center justify-center flex-row bg-black/50"
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            <Text className="text-white font-bold ml-1">Bearbeiten</Text>
          </TouchableOpacity>
        )}
        {!isOwner && (
          <TouchableOpacity 
            onPress={handleReport} 
            className="absolute top-12 right-5 w-10 h-10 rounded-full items-center justify-center bg-black/50"
          >
            <MaterialCommunityIcons name="flag" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View className="px-5 py-6">
        <Text className="text-2xl font-bold mb-1 text-textmain dark:text-neutral-100">
          {batch.recipes.name} {dayjs(batch.date_batch).format("DD.MM.YYYY")} 
        </Text>
        <Text className="text-base opacity-60 mb-6 text-textmain dark:text-neutral-400">
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
          <Text className="text-lg font-bold mb-3 border-b pb-2 text-textmain dark:text-neutral-100 dark:border-neutral-800">
            Milch
          </Text>
          {batch.milk_in_batch.map((m: any, index: number) => (
            <View key={index} className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="water" size={18} color="#52814d" />
              <Text className="ml-2 text-base text-textmain dark:text-neutral-300">
                {m.ingredients.name}: <Text className="font-bold">{m.amount} L</Text>
              </Text>
            </View>
          ))}
        </View>

        {batch.description && (
          <View className="mb-8 ">
            <Text className="text-lg font-bold mb-3 border-b pb-2 text-textmain dark:text-neutral-100 dark:border-neutral-800">
              Beschreibung
            </Text>
            <RenderHTML
              contentWidth={Dimensions.get("window").width - 40}
              source={{ html: batch.description }}
              baseStyle={{ 
                color: currentScheme === 'dark' ? '#ECEDEE' : '#2a2424', 
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

        <View className="flex-row items-center pt-6 border-t dark:border-neutral-800 border-neutral-100">
          {batch.users.avatar && (
            <Image source={{ uri: batch.users.avatar }} className="w-10 h-10 rounded-full" />
          )}
          <Text className="ml-3 text-base font-bold text-textmain dark:text-neutral-100">
            {batch.users.username}
          </Text>
        </View>
      </View>
      <View className="h-10" />
    </ScrollView>

    {/* REPORT MODAL */}
    <Modal
      animationType="fade"
      transparent={true}
      visible={reportModalVisible}
      onRequestClose={() => setReportModalVisible(false)}
    >
      <Pressable 
        className="flex-1 bg-black/50 justify-center items-center px-6"
        onPress={() => setReportModalVisible(false)}
      >
        <Pressable 
          className="w-full bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-textmain dark:text-neutral-100">Inhalt melden</Text>
            <TouchableOpacity onPress={() => setReportModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color={currentScheme === 'dark' ? '#fff' : '#333'} />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 dark:text-neutral-400 mb-6">Warum möchten Sie diesen Inhalt melden?</Text>
          
          <View className="gap-y-1">
            <ReportReasonButton label="Spam" onPress={() => submitReport("Spam")} icon="mail-off" isDark={currentScheme === 'dark'} />
            <ReportReasonButton label="Unangemessen" onPress={() => submitReport("Inappropriate")} icon="alert-circle-outline" isDark={currentScheme === 'dark'} />
            <ReportReasonButton label="Beleidigend" onPress={() => submitReport("Harassment")} icon="account-cancel-outline" isDark={currentScheme === 'dark'} />
            <ReportReasonButton label="Anderes" onPress={() => submitReport("Other")} icon="dots-horizontal-circle-outline" isDark={currentScheme === 'dark'} />
          </View>

          <TouchableOpacity 
            onPress={() => setReportModalVisible(false)}
            className="mt-6 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl"
          >
            <Text className="text-center font-bold text-gray-700 dark:text-neutral-300">Abbrechen</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
    </View>
  );
}

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => {
  return (
    <View 
      className="p-4 rounded-xl items-center justify-center flex-1 min-w-[45%] bg-neutral-100 dark:bg-neutral-800"
    >
      <MaterialCommunityIcons name={icon as any} size={24} color="#e29b03" />
      <Text className="text-xs opacity-60 mt-2 text-center text-textmain dark:text-neutral-400">
        {label}
      </Text>
      <Text className="text-sm font-bold mt-1 text-center text-textmain dark:text-neutral-100">
        {value}
      </Text>
    </View>
  );
};

const ReportReasonButton = ({ label, onPress, icon, isDark }: { label: string; onPress: () => void; icon: any; isDark: boolean }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center p-4 rounded-2xl border mb-3 ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-gray-50 border-gray-100'}`}
  >
    <MaterialCommunityIcons name={icon} size={22} color="#52814d" />
    <Text className={`ml-3 text-lg font-medium ${isDark ? 'text-neutral-100' : 'text-textmain'}`}>{label}</Text>
  </TouchableOpacity>
);
