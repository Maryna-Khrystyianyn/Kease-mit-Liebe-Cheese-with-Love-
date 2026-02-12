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
  StyleSheet,
  Modal,
  FlatList
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { 
  getMilkTypes, 
  getRecipes,
  createBatch, 
  uploadImage 
} from "@/services/cheese";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { textToHtml } from "@/services/stripHtml";

export default function NewBatchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [milkTypes, setMilkTypes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    description: "",
    cheeseweight: "",
    foto: "",
    onTimeLine: true,
    created_at: dayjs().format("YYYY-MM-DD"),
    ready_at: dayjs().add(1, 'month').format("YYYY-MM-DD"),
    recipe_id: null as number | null,
    recipeName: "Wählen Sie ein Rezept",
    milkItems: [] as any[]
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesData, milks] = await Promise.all([
          getRecipes(),
          getMilkTypes()
        ]);

        const sortedRecipes = (recipesData as any[]).sort((a, b) => 
          a.name.localeCompare(b.name)
        );

        setRecipes(sortedRecipes);
        setMilkTypes(milks);
        
        const initialMilks = milks.map((m: any) => ({
          milk_id: m.id,
          name: m.name,
          amount: "0"
        }));

        setFormData(prev => ({
          ...prev,
          milkItems: initialMilks
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Fehler", "Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const selectRecipe = (recipe: any) => {
    setFormData(prev => ({
      ...prev,
      recipe_id: recipe.id,
      recipeName: recipe.name
    }));
    setRecipeModalVisible(false);
  };

  const handleSave = async (isPublic: boolean) => {
    if (!formData.recipe_id) return Alert.alert("Fehler", "Bitte ein Rezept auswählen");
    if (!formData.created_at) return Alert.alert("Fehler", "Bitte Herstellungsdatum auswählen");
    if (!formData.ready_at) return Alert.alert("Fehler", "Bitte Reifedatum auswählen");
    
    setSaving(true);
    try {
      let finalImageUrl = "";
      if (imageUri) {
        finalImageUrl = await uploadImage(imageUri);
      }

      await createBatch({
        recipe_id: formData.recipe_id,
        description: textToHtml(formData.description),
        cheeseweight: formData.cheeseweight ? Number(formData.cheeseweight) : null,
        foto: finalImageUrl,
        milk_in_batch: formData.milkItems?.map(m => ({
          milk_id: m.milk_id,
          amount: Number(m.amount)
        })) || [],
        created_at: formData.created_at,
        ready_at: formData.ready_at,
        ispublic: isPublic,
        onTimeLine: formData.onTimeLine
      });

      Alert.alert("Erfolg", "Neue Käsecharge erstellt", [
        { text: "OK", onPress: () => router.replace("/cheese") }
      ]);
    } catch (error: any) {
      console.error("Error creating batch:", error);
      Alert.alert("Fehler", error.message || "Konnte nicht erstellt werden.");
    } finally {
      setSaving(false);
    }
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
            Neue Charge
          </Text>
        </View>

        {/* Recipe Selection */}
        <TouchableOpacity 
          onPress={() => setRecipeModalVisible(true)} 
          className="mb-4 p-4 border rounded-xl flex-row items-center justify-between"
          style={{ borderColor: colors.border, backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e' }}
        >
          <View>
            <Text className="text-xs opacity-60" style={{ color: colors.text }}>Rezept</Text>
            <Text className="text-base font-bold" style={{ color: formData.recipe_id ? "#e29b03" : colors.text }}>
              {formData.recipeName}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color={colors.text} style={{ opacity: 0.6 }} />
        </TouchableOpacity>

        {/* Image Section */}
        <TouchableOpacity onPress={pickImage} className="mt-2 mb-6 items-center">
          <View className="w-full h-48 rounded-xl overflow-hidden bg-gray-200 border-2 border-dashed border-gray-400 items-center justify-center">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <MaterialCommunityIcons name="camera" size={40} color="#666" />
                <Text className="text-gray-600 mt-2">Bild hinzufügen</Text>
                <Text className="text-gray-400 text-xs">(Optional)</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Date Fields */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-bold mb-2" style={{ color: colors.text }}>
              Herstellung <Text className="text-orange-500">*</Text>
            </Text>
            <TextInput
              className="p-3 border rounded-xl"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e' }}
              value={formData.created_at}
              onChangeText={(val) => setFormData(prev => ({ ...prev, created_at: val }))}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold mb-2" style={{ color: colors.text }}>
              Bereit am <Text className="text-orange-500">*</Text>
            </Text>
            <TextInput
              className="p-3 border rounded-xl"
              style={{ borderColor: colors.border, color: colors.text, backgroundColor: colorScheme === 'light' ? '#fff' : '#2c2c2e' }}
              value={formData.ready_at}
              onChangeText={(val) => setFormData(prev => ({ ...prev, ready_at: val }))}
              placeholder="YYYY-MM-DD"
            />
          </View>
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
            {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Nur Speichern</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleSave(true)}
            disabled={saving}
            className="p-4 rounded-xl items-center"
            style={{ backgroundColor: "#52814d" }}
          >
            <Text className="text-white font-bold text-lg">Veröffentlichen</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recipe Selection Modal */}
      <Modal
        visible={recipeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRecipeModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="h-2/3 w-full rounded-t-3xl p-6" style={{ backgroundColor: colors.background }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold" style={{ color: colors.text }}>Rezept wählen</Text>
              <TouchableOpacity onPress={() => setRecipeModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => selectRecipe(item)}
                  className="py-4 border-b ml-2"
                  style={{ borderBottomColor: colors.border }}
                >
                  <Text className="text-lg" style={{ color: colors.text }}>{item.name}</Text>
                  <Text className="text-sm opacity-60" style={{ color: colors.text }}>{item.recipes_categories?.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="items-center mt-10">
                  <Text style={{ color: colors.text }}>Keine Rezepte gefunden.</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      <View className="h-10" />
    </ScrollView>
  );
}
