import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-row items-center pt-16 pb-5 px-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>Datenschutzerklärung</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-3xl font-bold mb-1" style={{ color: colors.tint }}>Käse mit Liebe</Text>
        <Text className="text-sm mb-5" style={{ color: colors.icon }}>Letzte Aktualisierung: 12. Februar 2026</Text>

        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Diese Datenschutzerklärung beschreibt, wie die Käse mit Liebe App und Website (im Folgenden „Service“, „wir“, „unser“) Benutzerinformationen sammelt, verwendet und schützt.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>1. Welche Daten wir sammeln</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Bei der Registrierung und Nutzung des Service können wir folgende Daten sammeln:{"\n"}
          • E-Mail-Adresse (E-Mail){"\n"}
          • Passwort (verschlüsselt gespeichert){"\n"}
          • Telefonnummer (optional){"\n"}
          • Benutzerprofil-Daten
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>2. Wie wir Daten verwenden</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Die gesammelten Daten werden verwendet für:{"\n"}
          • Erstellung und Verwaltung des Benutzerkontos{"\n"}
          • Anmeldung im System{"\n"}
          • Gewährleistung des Betriebs der App und Website{"\n"}
          • Kontaktaufnahme mit dem Benutzer bei Bedarf
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>3. Profilanzeige</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Die E-Mail des Benutzers kann im Profil angezeigt werden:{"\n"}
          • Wenn das Profil öffentlich ist, können andere Benutzer die E-Mail sehen.{"\n"}
          • Wenn das Profil privat ist, sieht nur der Kontoinhaber die E-Mail.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>4. Wo Daten gespeichert werden</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Die Daten werden auf sicheren Servern von Drittanbietern gespeichert:{"\n"}
          • Vercel (Hosting der Website){"\n"}
          • Neon (Datenbank){"\n\n"}
          Wir ergreifen angemessene Maßnahmen, um Benutzerinformationen zu schützen.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>5. Weitergabe an Dritte</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Wir verkaufen oder geben personenbezogene Daten nicht an Dritte weiter, außer in Fällen, die für den Betrieb des Service erforderlich sind.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>6. Werbung und Analyse</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Im Service werden keine Werbung und keine Analysen von Drittanbietern verwendet.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>7. Online-Shop</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Auf der Website kann ein Demonstrations-Online-Shop angezeigt werden, der keine realен Verkäufe tätigt und keine Zahlungsdaten verarbeitet.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>8. Löschung von Konto und Daten</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Der Benutzer kann die Löschung seines Kontos und seiner personenbezogenen Daten beantragen, indem er uns über die auf der Website angegebenen Kontakte kontaktiert.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>9. Zweck des Projekts</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Der Service ist ein Bildungsprojekt, das zum Zweck der Erlernung der Entwicklung von Websites und mobilen Apps erstellt wurde.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>10. Änderungen der Richtlinie</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Wir können diese Datenschutzerklärung periodisch aktualisieren. Die aktuelle Version ist immer auf dieser Seite verfügbar.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>11. Kontakt</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Wenn Sie Fragen zu dieser Datenschutzerklärung haben, können Sie uns über die auf der Website angegebenen Kontaktinformationen kontaktieren.
        </Text>

        <Text className="text-sm italic mt-8 pt-5 border-t border-gray-200" style={{ color: colors.icon }}>
          Durch die Nutzung der Käse mit Liebe App oder Website stimmen Sie dieser Datenschutzerklärung zu.
        </Text>
      </ScrollView>
    </View>
  );
}
