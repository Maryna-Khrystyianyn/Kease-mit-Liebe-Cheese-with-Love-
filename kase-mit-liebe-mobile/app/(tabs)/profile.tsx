import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  Alert
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { getMe, getUserStats, updateProfile } from "@/services/auth";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Counter } from "@/components/Counter";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

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

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ThemedText>Bitte melden Sie sich an, um Ihr Profil zu sehen.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.icon }]}>
            <IconSymbol name="person.fill" size={60} color="#fff" />
          </View>
        )}
        <ThemedText type="title" style={styles.nickname}>{user.nick_name}</ThemedText>
        <ThemedText style={styles.email}>{user.email}</ThemedText>
        
        <TouchableOpacity 
          style={[styles.editButton, { borderColor: "#e29b03", borderWidth: 2
          }]} 
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#52814d"/>
          ) : (
            <ThemedText style={{ color: "#52814d", fontWeight: 'bold' }}>
              {isEditing ? "Speichern" : "Profil bearbeiten"}
            </ThemedText>
          )}
        </TouchableOpacity>
        {isEditing && !saving && (
          <TouchableOpacity onPress={() => setIsEditing(false)} style={{ marginTop: 10 }}>
            <Text style={{ color: 'red' }}>Abbrechen</Text>
          </TouchableOpacity>
        )}
      </ThemedView>

      <View style={styles.section}>
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
        
        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Profilstatus:</ThemedText>
          {isEditing ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ThemedText>{formData.ispublic ? "Öffentlich" : "Privat"}</ThemedText>
              <Switch 
                value={formData.ispublic} 
                onValueChange={(val) => setFormData({ ...formData, ispublic: val })} 
              />
            </View>
          ) : (
            <ThemedText style={styles.infoValue}>{user.ispublic ? "Öffentlich" : "Privat"}</ThemedText>
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

      <View style={styles.statsSection}>
        <StatCard 
          label="Gesamtproduktion" 
          value={stats?.total || 0} 
          suffix=" kg" 
          icon="calendar" 
        />
        <StatCard 
          label="Produktion dieses Jahr" 
          value={stats?.year || 0} 
          suffix=" kg" 
          icon="calendar.badge.clock" 
        />
        <StatCard 
          label="Produktion diesen Monat" 
          value={stats?.month || 0} 
          suffix=" kg" 
          icon="clock.fill" 
        />
      </View>
      <View style={{ height: 40 }} />
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
    <View style={[styles.infoRow, vertical && styles.verticalInfoRow]}>
      <ThemedText style={[styles.infoLabel, vertical && styles.verticalLabel]}>{label}:</ThemedText>
      {isEditing ? (
        <TextInput
          style={[
            vertical ? styles.verticalInput : styles.input, 
            { 
              color: colors.text, 
              borderColor: colors.icon,
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f9f9f9',
              minHeight: multiline ? 60 : 40
            }
          ]}
          value={value || ""}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder={`${label} eingeben...`}
          placeholderTextColor="#999"
        />
      ) : (
        <ThemedText style={[styles.infoValue, vertical && styles.verticalValue]}>{value || "Nicht angegeben"}</ThemedText>
      )}
    </View>
  );
};

const StatCard = ({ label, value, suffix, icon }: { label: string; value: number; suffix: string; icon: string }) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  
  return (
    <View style={[styles.statCard, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2c2c2e' }]}>
      <IconSymbol name={icon as any} size={24} color={colors.tint} />
      <View style={styles.statContent}>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
        <Counter targetValue={value} suffix={suffix} style={styles.statValue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  nickname: {
    marginBottom: 4,
  },
  email: {
    opacity: 0.6,
  },
  editButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    gap: 10,
  },
  verticalInfoRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 0.4,
  },
  verticalLabel: {
    flex: 0,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    opacity: 0.8,
    flex: 0.6,
    textAlign: 'right',
  },
  verticalValue: {
    flex: 0,
    textAlign: 'left',
    width: '100%',
  },
  input: {
    flex: 0.6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  verticalInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 15,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    gap: 15,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
});