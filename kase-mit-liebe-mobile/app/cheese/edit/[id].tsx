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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { stripHtml, textToHtml } from "@/services/stripHtml";

export default function EditBatchScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#e29b03" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-5 pt-12 pb-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Charge bearbeiten
          </Text>
        </View>

        <Text className="text-base font-bold mb-1" style={{ color: "#e29b03" }}>
          Rezept: {formData.recipeName}
        </Text>

        {/* Image Section */}
        <TouchableOpacity onPress={pickImage} className="mt-4 mb-6 items-center">
          <View className="w-full h-48 rounded-xl overflow-hidden bg-gray-200 border-2 border-dashed border-gray-400 items-center justify-center">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <MaterialCommunityIcons name="camera" size={40} color="#666" />
                <Text className="text-gray-600 mt-2">Bild hinzufügen</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Date Field - Custom Input for Date for now */}
        <View className="mb-4">
          <Text className="text-sm font-bold mb-2" style={{ color: colors.text }}>
            Herstellungsdatum (YYYY-MM-DD) <Text className="text-orange-500">*</Text>
          </Text>
          <TextInput
            className="p-3 border rounded-xl"
            style={{ borderColor: colors.border, color: colors.text, backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e' }}
            value={formData.created_at}
            onChangeText={(val) => setFormData(prev => ({ ...prev, created_at: val }))}
            placeholder="2024-05-20"
          />
        </View>

        {/* Milk Selector */}
        <View className="mb-6">
          <Text className="text-sm font-bold mb-3" style={{ color: colors.text }}>
            Milch (Liter)
          </Text>
          {formData.milkItems.map((item) => (
            <View key={item.milk_id} className="flex-row items-center mb-3">
              <Text className="flex-1" style={{ color: colors.text }}>{item.name}</Text>
              <TextInput
                className="w-24 p-2 border rounded-lg text-center"
                style={{ borderColor: colors.border, color: colors.text, backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e' }}
                value={item.amount}
                keyboardType="numeric"
                onChangeText={(val) => handleMilkChange(item.milk_id, val)}
              />
            </View>
          ))}
        </View>

        {/* Weight Field */}
        <View className="mb-4">
          <Text className="text-sm font-bold mb-2" style={{ color: colors.text }}>
            Gewicht (kg)
          </Text>
          <TextInput
            className="p-3 border rounded-xl"
            style={{ borderColor: colors.border, color: colors.text, backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e' }}
            value={formData.cheeseweight}
            keyboardType="numeric"
            onChangeText={(val) => setFormData(prev => ({ ...prev, cheeseweight: val }))}
            placeholder="0.000"
          />
        </View>

        {/* Description Field */}
        <View className="mb-6">
          <Text className="text-sm font-bold mb-2" style={{ color: colors.text }}>
            Beschreibung
          </Text>
          <TextInput
            className="p-3 border rounded-xl"
            style={{ 
              borderColor: colors.border, 
              color: colors.text, 
              backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e',
              minHeight: 120
            }}
            value={formData.description}
            onChangeText={(val) => setFormData(prev => ({ ...prev, description: val }))}
            multiline
            textAlignVertical="top"
            placeholder="Details über diese Charge..."
          />
        </View>

        {/* Timeline Switch */}
        <View className="flex-row items-center justify-between mb-8 p-3 rounded-xl" style={{ backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#1c1c1e' }}>
          <Text className="text-base" style={{ color: colors.text }}>Auf Timeline anzeigen</Text>
          <Switch
            value={formData.onTimeLine}
            onValueChange={(val) => setFormData(prev => ({ ...prev, onTimeLine: val }))}
            trackColor={{ false: "#767577", true: "#e29b03" }}
          />
        </View>

        {/* Action Buttons */}
        <View className="gap-4">
          <TouchableOpacity 
            onPress={() => handleSave(false)}
            disabled={saving}
            className="p-4 rounded-xl items-center bg-gray-400"
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Speichern</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleSave(true)}
            disabled={saving}
            className="p-4 rounded-xl items-center"
            style={{ backgroundColor: "#52814d" }}
          >
            <Text className="text-white font-bold text-lg">Veröffentlichen</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDelete}
            disabled={saving}
            className="p-4 rounded-xl items-center bg-red-500"
          >
            <Text className="text-white font-bold text-lg">Löschen</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}
