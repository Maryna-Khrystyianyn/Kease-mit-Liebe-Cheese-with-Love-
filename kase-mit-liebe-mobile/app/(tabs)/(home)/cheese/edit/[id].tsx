import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  Alert,
  Switch,
  StyleSheet
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { 
  getBatchDetails, 
  getMilkTypes, 
  updateBatch, 
  deleteBatch, 
  uploadImage 
} from "@/services/cheese";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/theme";
import { stripHtml, textToHtml } from "@/services/stripHtml";

export default function EditBatchScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const currentScheme = colorScheme || "light";
  const colors = Colors[currentScheme];
  const isDark = currentScheme === "dark";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [milkTypes, setMilkTypes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    description: "",
    cheeseweight: "",
    foto: "",
    onTimeLine: true,
    created_at: dayjs().format("YYYY-MM-DD"),
    ready_at: "",
    recipe_id: null,
    recipeName: "",
    milkItems: [] as any[]
  });

  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batch, milks] = await Promise.all([
          getBatchDetails(id as string),
          getMilkTypes()
        ]);

        setMilkTypes(milks);
        
        const initialMilks = milks.map((m: any) => {
          const existing = batch.milk_in_batch?.find((em: any) => em.milk_id === m.id);
          return {
            milk_id: m.id,
            name: m.name,
            amount: existing ? existing.amount.toString() : "0"
          };
        });

        setFormData({
          description: stripHtml(batch.description || ""),
          cheeseweight: batch.cheeseweight?.toString() || "",
          foto: batch.foto || "",
          onTimeLine: batch.onTimeLine,
          created_at: dayjs(batch.created_at).format("YYYY-MM-DD"),
          ready_at: dayjs(batch.ready_at).format("YYYY-MM-DD"),
          recipe_id: batch.recipe_id,
          recipeName: batch.recipes.name,
          milkItems: initialMilks
        });
        
        if (batch.foto) setImageUri(batch.foto);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Fehler", "Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleMilkChange = (id: number, val: string) => {
    setFormData(prev => ({
      ...prev,
      milkItems: prev.milkItems.map(m => m.milk_id === id ? { ...m, amount: val } : m)
    }));
  };

  const handleSave = async (isPublic: boolean) => {
    if (!formData.created_at) return Alert.alert("Fehler", "Bitte Herstellungsdatum auswählen");
    
    setSaving(true);
    try {
      let finalImageUrl = formData.foto;
      if (imageUri && imageUri !== formData.foto) {
        finalImageUrl = await uploadImage(imageUri);
      }

      await updateBatch(id as string, {
        description: textToHtml(formData.description),
        cheeseweight: formData.cheeseweight ? Number(formData.cheeseweight) : null,
        foto: finalImageUrl,
        milk_in_batch: formData.milkItems.map(m => ({
          milk_id: m.milk_id,
          amount: Number(m.amount)
        })),
        created_at: formData.created_at,
        ready_at: formData.ready_at,
        ispublic: isPublic,
        onTimeLine: formData.onTimeLine,
        recipe_id: formData.recipe_id
      });

      Alert.alert("Erfolg", "Änderungen gespeichert", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error saving batch:", error);
      Alert.alert("Fehler", "Konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Löschen",
      "Möchten Sie diese Käsecharge wirklich löschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        { 
          text: "Löschen", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteBatch(id as string);
              router.replace("/cheese");
            } catch (error) {
              Alert.alert("Fehler", "Löschen fehlgeschlagen.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#e29b03" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
      <View className="px-5 pt-12 pb-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-textmain dark:text-neutral-100">
            Charge bearbeiten
          </Text>
        </View>

        <Text className="text-base font-bold mb-1 text-orange-500">
          Rezept: {formData.recipeName}
        </Text>

        {/* Image Section */}
        <TouchableOpacity onPress={pickImage} className="mt-4 mb-6 items-center">
          <View className="w-full h-48 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 items-center justify-center">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full resize-cover" />
            ) : (
              <View className="items-center">
                <MaterialCommunityIcons name="camera" size={40} color={isDark ? "#555" : "#666"} />
                <Text className="text-textmain dark:text-neutral-400 mt-2">Bild hinzufügen</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Date Field */}
        <View className="mb-4">
          <Text className="text-sm font-bold mb-2 text-textmain dark:text-neutral-100">
            Herstellungsdatum (YYYY-MM-DD) <Text className="text-orange-500">*</Text>
          </Text>
          <TextInput
            className="p-3 border rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-textmain dark:text-neutral-100"
            value={formData.created_at}
            onChangeText={(val) => setFormData(prev => ({ ...prev, created_at: val }))}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={isDark ? "#555" : "#999"}
          />
        </View>

        {/* Milk Selector */}
        <View className="mb-6">
          <Text className="text-sm font-bold mb-3 text-textmain dark:text-neutral-100">
            Milch (Liter)
          </Text>
          {formData.milkItems.map((item) => (
            <View key={item.milk_id} className="flex-row items-center mb-3">
              <Text className="flex-1 text-textmain dark:text-neutral-300">{item.name}</Text>
              <TextInput
                className="w-24 p-1.5 border rounded-lg text-center border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-textmain dark:text-neutral-100"
                value={item.amount}
                keyboardType="numeric"
                onChangeText={(val) => handleMilkChange(item.milk_id, val)}
              />
            </View>
          ))}
        </View>

        {/* Weight Field */}
        <View className="mb-4">
          <Text className="text-sm font-bold mb-2 text-textmain dark:text-neutral-100">
            Gewicht (kg)
          </Text>
          <TextInput
            className="p-3 border rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-textmain dark:text-neutral-100"
            value={formData.cheeseweight}
            keyboardType="numeric"
            onChangeText={(val) => setFormData(prev => ({ ...prev, cheeseweight: val }))}
            placeholder="0.000"
            placeholderTextColor={isDark ? "#555" : "#999"}
          />
        </View>

        {/* Description Field */}
        <View className="mb-6">
          <Text className="text-sm font-bold mb-2 text-textmain dark:text-neutral-100">
            Beschreibung
          </Text>
          <TextInput
            className="p-3 border rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-textmain dark:text-neutral-100 h-[120px]"
            value={formData.description}
            onChangeText={(val) => setFormData(prev => ({ ...prev, description: val }))}
            multiline
            textAlignVertical="top"
            placeholder="Details über diese Charge..."
            placeholderTextColor={isDark ? "#555" : "#999"}
          />
        </View>

        {/* Timeline Switch */}
        <View className="flex-row items-center justify-between mb-8 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
          <Text className="text-base text-textmain dark:text-neutral-200">Auf Timeline anzeigen</Text>
          <Switch
            value={formData.onTimeLine}
            onValueChange={(val) => setFormData(prev => ({ ...prev, onTimeLine: val }))}
            trackColor={{ false: isDark ? "#444" : "#cbd5e1", true: "#e29b03" }}
            thumbColor={formData.onTimeLine ? "#52814d" : (isDark ? "#666" : "#f1f5f9")}
          />
        </View>


        {/* Action Buttons */}
        <View className="gap-4">
          <TouchableOpacity 
            onPress={() => handleSave(false)}
            disabled={saving}
            className="p-4 rounded-xl items-center bg-neutral-400 dark:bg-neutral-700 active:opacity-80"
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Speichern</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleSave(true)}
            disabled={saving}
            className="p-4 rounded-xl items-center bg-olive_bright active:opacity-80 shadow-md"
          >
            <Text className="text-white font-bold text-lg">Veröffentlichen</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDelete}
            disabled={saving}
            className="p-4 rounded-xl items-center bg-red-500 active:opacity-80"
          >
            <Text className="text-white font-bold text-lg">Löschen</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}
