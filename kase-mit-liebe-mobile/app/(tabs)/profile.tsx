import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  Alert,
  Pressable
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { getMe, getUserStats, updateProfile, logout, deleteAccount } from "@/services/auth";
import { ThemedText } from "@/components/themed-text";
import { Counter } from "@/components/Counter";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const me = await getMe();
      if (me) {
        setUser(me);
        setFormData({
          username: me.username,
          telefon: me.telefon,
          user_address: me.user_address,
          ispublic: me.ispublic,
          mood: me.mood,
          info: me.info,
        });
        const userStats = await getUserStats(me.nick_name);
        setStats(userStats);
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      await loadData();
      setIsEditing(false);
      Alert.alert("Erfolg", "Profil wurde aktualisiert.");
    } catch (error: any) {
      Alert.alert("Fehler", error.message || "Fehler beim Aktualisieren.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Account löschen",
      "Bist du sicher, dass du dein Konto permanent löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace("/");
            } catch (error: any) {
              Alert.alert("Fehler", error.message);
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ThemedText>Bitte melden Sie sich an, um Ihr Profil zu sehen.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* HEADER */}
      <View className="items-center pt-16 pb-6">
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} className="w-32 h-32 rounded-full mb-3" />
        ) : (
          <View className="w-32 h-32 rounded-full justify-center items-center mb-3 bg-gray-400">
            <IconSymbol name="person.fill" size={60} color="#fff" />
          </View>
        )}

        <ThemedText type="title" className="mb-1">
          {user.nick_name}
        </ThemedText>

        <ThemedText className="opacity-60">
          {user.email}
        </ThemedText>

        {/* EDIT BUTTON */}
        <TouchableOpacity
          className="mt-4 px-6 py-2 rounded-full border-2 border-orange"
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#52814d" />
          ) : (
            <ThemedText className="text-olive_bright font-bold">
              {isEditing ? "Speichern" : "Profil bearbeiten"}
            </ThemedText>
          )}
        </TouchableOpacity>

        {isEditing && !saving && (
          <TouchableOpacity onPress={() => setIsEditing(false)} className="mt-3">
            <Text className="text-red-500">Abbrechen</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* INFO SECTION */}
      <View className="px-5 mt-5">
        <InfoItem
          label="Name"
          value={formData.username}
          isEditing={isEditing}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />

        <InfoItem
          label="Telefon"
          value={formData.telefon}
          isEditing={isEditing}
          onChangeText={(text) => setFormData({ ...formData, telefon: text })}
        />

        <InfoItem
          label="Adresse"
          value={formData.user_address}
          isEditing={isEditing}
          onChangeText={(text) => setFormData({ ...formData, user_address: text })}
        />

        {/* PROFILE STATUS */}
        <View className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <ThemedText className="font-bold text-base">
            Profilstatus:
          </ThemedText>

          {isEditing ? (
            <View className="flex-row items-center gap-2">
              <ThemedText>
                {formData.ispublic ? "Öffentlich" : "Privat"}
              </ThemedText>

              <Switch
                value={formData.ispublic}
                onValueChange={(val) => setFormData({ ...formData, ispublic: val })}
              />
            </View>
          ) : (
            <ThemedText className="opacity-80">
              {user.ispublic ? "Öffentlich" : "Privat"}
            </ThemedText>
          )}
        </View>

        <InfoItem 
          label="Stimmung" 
          value={formData.mood} 
          isEditing={isEditing}
          vertical
          onChangeText={(text) => setFormData({ ...formData, mood: text })}
        />
        <InfoItem 
          label="Über mich" 
          value={formData.info} 
          isEditing={isEditing}
          multiline
          vertical
          onChangeText={(text) => setFormData({ ...formData, info: text })}
        />
      </View>

      {/* STATS */}
      <View className="px-5 mt-8 gap-4">
        <StatCard label="Gesamtproduktion" value={stats?.total || 0} suffix=" kg" icon="calendar" />
        <StatCard label="Produktion dieses Jahr" value={stats?.year || 0} suffix=" kg" icon="calendar.badge.clock" />
        <StatCard label="Produktion diesen Monat" value={stats?.month || 0} suffix=" kg" icon="clock.fill" />
      </View>

      {/* BUTTONS */}
      <View className="px-5 mt-10 space-y-3 mb-5">
        <Pressable
          onPress={handleLogout}
          className="py-4 bg-olive_bright rounded-2xl"
        >
          <Text className="text-white text-center font-bold text-lg">
            Abmelden
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteAccount}
          className="py-4"
        >
          <Text className="text-red-500 text-center font-medium">
            Account löschen
          </Text>
        </Pressable>
      </View>

      {/* PRIVACY LINK */}
      <TouchableOpacity
        className="mt-8 items-center"
        onPress={() => router.push("/privacy-policy")}
      >
        <ThemedText className="text-orange underline">
          Datenschutzerklärung
        </ThemedText>
      </TouchableOpacity>

      {/* AGREEMENT */}
      <View className="mt-5 mb-12 px-5 items-center">
        <Text className="text-xs text-center opacity-70">
          Durch die Nutzung dieser App stimmen Sie unserer{" "}
          <Text
            className="text-blue-500 underline"
            onPress={() => router.push("/privacy-policy")}
          >
            Datenschutzerklärung
          </Text>{" "}
          zu.
        </Text>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ 
  label, 
  value, 
  isEditing, 
  onChangeText, 
  multiline,
  vertical
}: { 
  label: string; 
  value: string; 
  isEditing: boolean;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  vertical?: boolean;
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View className={`py-3 border-b border-gray-300 ${vertical ? "flex-col items-start gap-1" : "flex-row justify-between items-center gap-2"}`}>
      <ThemedText className={`font-bold text-base ${vertical ? "mb-1" : "flex-[0.4]"}`}>{label}:</ThemedText>
      {isEditing ? (
        <TextInput
          className={`${vertical ? "w-full py-2" : "flex-[0.6] py-1"} border rounded-lg px-3 text-base`}
          style={{ 
            color: colors.text, 
            borderColor: colors.icon,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f9f9f9',
            minHeight: multiline ? 60 : 40
          }}
          value={value || ""}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder={`${label} eingeben...`}
          placeholderTextColor="#999"
        />
      ) : (
        <ThemedText className={`text-base opacity-80 ${vertical ? "w-full text-left" : "flex-[0.6] text-right"}`}>{value || "Nicht angegeben"}</ThemedText>
      )}
    </View>
  );
};

const StatCard = ({ label, value, suffix, icon }: { label: string; value: number; suffix: string; icon: string }) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  
  return (
    <View 
      className={`flex-row items-center p-4 rounded-xl gap-4 ${colorScheme === 'light' ? 'bg-gray-100' : 'bg-[#2c2c2e]'}`}
    >
      <IconSymbol name={icon as any} size={24} color={colors.tint} />
      <View className="flex-1">
        <ThemedText className="text-sm opacity-70">{label}</ThemedText>
        <Counter targetValue={value} suffix={suffix} className="text-xl font-bold" />
      </View>
    </View>
  );
};