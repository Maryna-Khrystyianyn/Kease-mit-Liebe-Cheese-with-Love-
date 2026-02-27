import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { register } from "@/services/auth";
import { API_URL } from "@/constants/config";
import { useColorScheme } from "nativewind";
import { Eye, EyeOff } from "lucide-react-native";

import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function RegisterScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nick_name: "",
    username: "",
    email: "",
    password: "",
    telefon: "",
    user_address: "",
    mood: "",
    info: "",
    ispublic: true,
    issubscribed: true,
    avatar: "", // URI фото
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Вибір фото з галереї
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Zugriff auf die Galerie erforderlich");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      handleChange("avatar", result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let avatarUrl = form.avatar;
  
      // 1️⃣ Завантажуємо аватарку, якщо є
      if (form.avatar) {
        const imageData = new FormData();
        const uriParts = form.avatar.split(".");
        const fileType = uriParts[uriParts.length - 1];
  
        imageData.append("file", {
          uri: form.avatar,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        } as any);
  
        const uploadRes = await fetch(`${API_URL}/upload-avatar`, {
          method: "POST",
          body: imageData,
        });
  
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
  
        avatarUrl = uploadData.url;
      }
  
      // 2️⃣ Відправляємо дані на сервер як JSON
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          avatar: avatarUrl, // Використовуємо отриманий URL
        }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
  
      // 4️⃣ Зберігаємо токен у SecureStore, щоб автоматично залогінити користувача
      if (data.token) {
        await SecureStore.setItemAsync("token", data.token);
      }
  
      Alert.alert("Erfolg", "Registrierung erfolgreich");
  
      // 5️⃣ Переходимо на головну
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Fehler", e.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900 p-4">
      <Text className="text-3xl font-bold mb-6 text-textmain dark:text-neutral-100">Registrierung</Text>

      {/* Фото профілю */}
      <Pressable onPress={pickImage} className="mb-4 items-center">
        {form.avatar ? (
          <Image
            source={{ uri: form.avatar }}
            className="w-32 h-32 rounded-full border-2 border-olive_bright"
          />
        ) : (
          <View className="w-32 h-32 bg-gray-200 dark:bg-neutral-800 rounded-full items-center justify-center border-2 border-dashed border-olive_bright">
            <Text className="text-textmain dark:text-neutral-400">Foto wählen</Text>
          </View>
        )}
      </Pressable>

      {/* Inputs */}
      <Input label="Spitzname *" value={form.nick_name} onChange={(v:string) => handleChange("nick_name", v)} isDark={isDark} />
      <Input label="Benutzername *" value={form.username} onChange={(v:string) => handleChange("username", v)} isDark={isDark} />
      <Input label="E-Mail *" value={form.email} onChange={(v:string) => handleChange("email", v)} isDark={isDark} />
      <Input label="Passwort *" value={form.password} secure onChange={(v:string) => handleChange("password", v)} isDark={isDark} />
      <Input label="Telefon" value={form.telefon} onChange={(v:string) => handleChange("telefon", v)} isDark={isDark} />
      <Input label="Adresse" value={form.user_address} onChange={(v:string) => handleChange("user_address", v)} isDark={isDark} />
      <Input label="Stimmung" value={form.mood} multiline onChange={(v:string) => handleChange("mood", v)} isDark={isDark} />
      <Input label="Informationen über dich" value={form.info} multiline onChange={(v:string) => handleChange("info", v)} isDark={isDark} />

      {/* Switches */}
      <View className="flex-row justify-between items-center my-3">
        <Text className="text-textmain dark:text-neutral-300">Öffentliches Profil</Text>
        <View className="scale-125">
          <Switch
            value={form.ispublic}
            onValueChange={(v) => handleChange("ispublic", v)}
            trackColor={{ false: isDark ? "#444" : "#e5e5e5", true: "#e29b03" }}
            thumbColor={form.ispublic ? "#52814d" : "#a8b6a6"}
          />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-textmain dark:text-neutral-300">Newsletter abonnieren</Text>
        <View className="scale-125">
          <Switch
            value={form.issubscribed}
            onValueChange={(v) => handleChange("issubscribed", v)}
            trackColor={{ false: isDark ? "#444" : "#e5e5e5", true: "#e29b03" }}
            thumbColor={form.issubscribed ? "#52814d" : "#a8b6a6"}
          />
        </View>
      </View>

      <Pressable 
        onPress={handleRegister} 
        disabled={loading}
        className={`bg-olive_bright py-3 rounded mb-20 active:opacity-80 ${loading ? 'opacity-50' : ''}`}
      >
        <Text className="text-white text-center font-bold text-lg">Registrieren</Text>
      </Pressable>
      <LoadingOverlay visible={loading} />
    </ScrollView>
  );
}

/* reusable Input */
function Input({ label, value, onChange, secure = false, multiline = false, isDark }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = secure && !multiline;

  return (
    <View className="mb-4">
      <Text className="mb-1 text-olive_bright font-medium">{label}</Text>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={isPasswordField ? !showPassword : false}
          multiline={multiline}
          placeholderTextColor={isDark ? "#777" : "#999"}
          className="border border-olive p-3 rounded text-textmain dark:text-neutral-100 bg-transparent dark:bg-neutral-800 w-full"
        />
        {isPasswordField && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? (
              <EyeOff size={24} color={isDark ? "#888" : "#666"} />
            ) : (
              <Eye size={24} color={isDark ? "#888" : "#666"} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
