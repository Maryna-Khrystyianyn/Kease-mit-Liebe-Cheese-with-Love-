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
import { register } from "@/services/auth"; // твоя функція register повинна підтримувати FormData
import { API_URL } from "@/constants/config";

export default function RegisterScreen() {
  const router = useRouter();

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
  
      // 2️⃣ Формуємо FormData для реєстрації
      const formDataToSend = new FormData();
      for (const key in form) {
        if (key === "avatar") {
          formDataToSend.append("avatar", avatarUrl);
        } else {
          const value = typeof form[key as keyof typeof form] === "boolean"
            ? form[key as keyof typeof form] ? "true" : "false"
            : form[key as keyof typeof form];
          formDataToSend.append(key, value as string);
        }
      }
  
      // 3️⃣ Відправляємо на сервер
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: formDataToSend,
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
    }
  };
  
  

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold mb-6">Registrierung</Text>

      {/* Фото профілю */}
      <Pressable onPress={pickImage} className="mb-4 items-center">
        {form.avatar ? (
          <Image
            source={{ uri: form.avatar }}
            className="w-32 h-32 rounded-full"
          />
        ) : (
          <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center">
            <Text>Foto wählen</Text>
          </View>
        )}
      </Pressable>

      {/* Inputs */}
      <Input label="Spitzname *" value={form.nick_name} onChange={(v:string) => handleChange("nick_name", v)} />
      <Input label="Benutzername *" value={form.username} onChange={(v:string) => handleChange("username", v)} />
      <Input label="E-Mail *" value={form.email} onChange={(v:string) => handleChange("email", v)} />
      <Input label="Passwort *" value={form.password} secure onChange={(v:string) => handleChange("password", v)} />
      <Input label="Telefon" value={form.telefon} onChange={(v:string) => handleChange("telefon", v)} />
      <Input label="Adresse" value={form.user_address} onChange={(v:string) => handleChange("user_address", v)} />
      <Input label="Stimmung" value={form.mood} multiline onChange={(v:string) => handleChange("mood", v)} />
      <Input label="Informationen über dich" value={form.info} multiline onChange={(v:string) => handleChange("info", v)} />

      {/* Switches */}
      <View className="flex-row justify-between items-center my-3">
        <Text>Öffentliches Profil</Text>
        <View style={{ transform: [{ scale: 1.3 }] }}>
          <Switch
            value={form.ispublic}
            onValueChange={(v) => handleChange("ispublic", v)}
            trackColor={{ false: "#e5e5e5", true: "#e29b03" }}
            thumbColor={form.ispublic ? "#52814d" : "#a8b6a6"}
          />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-6">
        <Text>Newsletter abonnieren</Text>
        <View style={{ transform: [{ scale: 1.3 }] }}>
          <Switch
            value={form.issubscribed}
            onValueChange={(v) => handleChange("issubscribed", v)}
            trackColor={{ false: "#e5e5e5", true: "#e29b03" }}
            thumbColor={form.issubscribed ? "#52814d" : "#a8b6a6"}
          />
        </View>
      </View>

      <Pressable onPress={handleRegister} className="bg-olive_bright py-3 rounded mb-20">
        <Text className="text-white text-center font-bold text-lg">Registrieren</Text>
      </Pressable>
    </ScrollView>
  );
}

/* reusable Input */
function Input({ label, value, onChange, secure = false, multiline = false }: any) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-olive_bright">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        multiline={multiline}
        className="border border-olive p-3 rounded"
      />
    </View>
  );
}
