import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { register } from "@/services/auth";
import { useRouter } from "expo-router";

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
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      await register(form);
      Alert.alert("Erfolg", "Registrierung erfolgreich");
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Fehler", e.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4 ">
      <Text className="text-3xl font-bold mb-6">Registrierung</Text>

      <Input
        label="Spitzname *"
        value={form.nick_name}
        onChange={(v: string) => handleChange("nick_name", v)}
      />
      <Input
        label="Benutzername *"
        value={form.username}
        onChange={(v: string) => handleChange("username", v)}
      />
      <Input
        label="E-Mail *"
        value={form.email}
        onChange={(v: string) => handleChange("email", v)}
      />
      <Input
        label="Passwort *"
        value={form.password}
        secure
        onChange={(v: string) => handleChange("password", v)}
      />

      <Input
        label="Telefon"
        value={form.telefon}
        onChange={(v: string) => handleChange("telefon", v)}
      />
      <Input
        label="Adresse"
        value={form.user_address}
        onChange={(v: string) => handleChange("user_address", v)}
      />

      <Input
        label="Stimmung"
        value={form.mood}
        multiline
        onChange={(v: string) => handleChange("mood", v)}
      />
      <Input
        label="Informationen über dich"
        value={form.info}
        multiline
        onChange={(v: string) => handleChange("info", v)}
      />

      {/* Switches */}
      <View className="flex-row justify-between items-center my-3">
        <Text>Öffentliches Profil</Text>
        <View style={{ transform: [{ scale: 1.3 }] }}>
          <Switch
            value={form.ispublic}
            onValueChange={(v) => handleChange("ispublic", v)}
            trackColor={{ false: "#e5e5e5", true: "#e29b03" }}
            thumbColor={form.ispublic ? "#52814d" : "#a8b6a6"}
            ios_backgroundColor="#e5e5e5"
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
            thumbColor={form.ispublic ? "#52814d" : "#a8b6a6"}
            ios_backgroundColor="#e5e5e5"
          />
        </View>
      </View>

      <Pressable
        onPress={handleRegister}
        className="bg-olive_bright py-3 rounded mb-20"
      >
        <Text className="text-white text-center font-bold text-lg ">
          Registrieren
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* reusable input */
function Input({
  label,
  value,
  onChange,
  secure = false,
  multiline = false,
}: any) {
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
