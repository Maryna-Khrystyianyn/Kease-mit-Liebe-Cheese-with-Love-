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
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/theme";
import { textToHtml } from "@/services/stripHtml";

export default function NewBatchScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const currentScheme = colorScheme || "light";
  const colors = Colors[currentScheme];
  const isDark = currentScheme === "dark";

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
            Neue Charge
          </Text>
        </View>

        {/* Recipe Selection */}
        <TouchableOpacity 
          onPress={() => setRecipeModalVisible(true)} 
          className="mb-4 p-4 border rounded-xl flex-row items-center justify-between border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm"
        >
          <View>
            <Text className="text-xs opacity-60 text-textmain dark:text-neutral-400">Rezept</Text>
            <Text className={`text-base font-bold ${formData.recipe_id ? 'text-orange-500' : 'text-textmain dark:text-neutral-100'}`}>
              {formData.recipeName}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color={isDark ? "#999" : "#666"} />
        </TouchableOpacity>

        {/* ... image section ... */}
        <TouchableOpacity onPress={pickImage} className="mt-2 mb-6 items-center">
          <View className="w-full h-48 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 items-center justify-center">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full resize-cover" />
            ) : (
              <View className="items-center">
                <MaterialCommunityIcons name="camera" size={40} color={isDark ? "#555" : "#666"} />
                <Text className="text-textmain dark:text-neutral-400 mt-2">Bild hinzufügen</Text>
                <Text className="text-neutral-400 text-xs">(Optional)</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* ... date fields ... */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-bold mb-2 text-textmain dark:text-neutral-100">
              Herstellung <Text className="text-orange-500">*</Text>
            </Text>
            <TextInput
              className="p-3 border rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-textmain dark:text-neutral-100"
              value={formData.created_at}
              onChangeText={(val) => setFormData(prev => ({ ...prev, created_at: val }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? "#555" : "#999"}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold mb-2 text-textmain dark:text-neutral-100">
              Bereit am <Text className="text-orange-500">*</Text>
            </Text>
            <TextInput
              className="p-3 border rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-textmain dark:text-neutral-100"
              value={formData.ready_at}
              onChangeText={(val) => setFormData(prev => ({ ...prev, ready_at: val }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={isDark ? "#555" : "#999"}
            />
          </View>
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
            {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Nur Speichern</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleSave(true)}
            disabled={saving}
            className="p-4 rounded-xl items-center bg-olive_bright active:opacity-80 shadow-md"
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
        <View className="flex-1 justify-end bg-black/60">

          <View className="h-2/3 w-full rounded-t-3xl p-6 bg-white dark:bg-neutral-900">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-textmain dark:text-neutral-100">Rezept wählen</Text>
              <TouchableOpacity onPress={() => setRecipeModalVisible(false)} className="p-1">
                <MaterialCommunityIcons name="close" size={24} color={isDark ? "#fff" : "#000"} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => selectRecipe(item)}
                  className="py-4 border-b border-neutral-100 dark:border-neutral-800 ml-2"
                >
                  <Text className="text-lg text-textmain dark:text-neutral-100">{item.name}</Text>
                  <Text className="text-sm opacity-60 text-textmain dark:text-neutral-400">{item.recipes_categories?.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="items-center mt-10">
                  <Text className="text-textmain dark:text-neutral-400">Keine Rezepte gefunden.</Text>
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
