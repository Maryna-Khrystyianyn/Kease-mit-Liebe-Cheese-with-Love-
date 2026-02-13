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
        <Text className="text-sm mb-5" style={{ color: colors.icon }}>Letzte Aktualisierung: 13. Februar 2026</Text>

        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Diese Datenschutzerklärung beschreibt, wie die Käse mit Liebe App und Website (im Folgenden „Service“, „wir“, „unser“) Benutzerinformationen sammelt, verwendet und schützt.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>1. Welche Daten wir sammeln</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Bei der Registrierung und Nutzung des Service können wir folgende Daten sammeln:{"\n"}
          • E-Mail-Adresse (verschlüsselt){"\n"}
          • Passwort (verschlüsselt gespeichert){"\n"}
          • Telefonnummer (optional){"\n"}
          • Benutzerprofil-Daten{"\n"}
          • Fotos und Bilder, die Sie für Ihren Avatar oder Ihre Käse-Chargen hochladen (erfordert Kamera- oder Dateizugriff)
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>2. Wie wir Daten verwenden</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Die gesammelten Daten werden verwendet für:{"\n"}
          • Erstellung und Verwaltung des Benutzerkontos{"\n"}
          • Anmeldung im System{"\n"}
          • Anzeige von Benutzerprofilen und hochgeladenen Fotos{"\n"}
          • Gewährleistung des Betriebs der App und Website{"\n"}
          • Kontaktaufnahme mit dem Benutzer bei Bedarf
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>3. Nutzung der Kamera und Fotos</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Um Fotos für Avatare oder Käse-Chargen hochzuladen, benötigt die App Zugriff auf die Kamera oder die Fotobibliothek Ihres Geräts.{"\n"}
          • Sie können diese Berechtigungen jederzeit in Ihren Geräteeinstellungen widerrufen.{"\n"}
          • Inhalte, die Urheberrechte verletzen oder gegen unsere Richtlinien verstoßen, können von anderen Nutzern gemeldet werden.{"\n"}
          • Wir überprüfen Meldungen innerhalb von 24 Stunden und entfernen gegebenenfalls unangemessene Inhalte.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>4. Profilanzeige</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Die E-Mail des Benutzers kann im Profil angezeigt werden:{"\n"}
          • Öffentliches Profil: andere Nutzer sehen die E-Mail.{"\n"}
          • Privates Profil: nur der Kontoinhaber sieht die E-Mail.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>5. Wo Daten gespeichert werden</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Die Daten werden auf sicheren Servern von Drittanbietern gespeichert:{"\n"}
          • Vercel (Hosting der Website){"\n"}
          • Neon (Datenbank){"\n\n"}
          Wir ergreifen angemessene Maßnahmen, um Benutzerinformationen zu schützen.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>6. Weitergabe an Dritte</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Wir verkaufen oder geben personenbezogene Daten nicht an Dritte weiter, außer in Fällen, die für den Betrieb des Service erforderlich sind.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>7. Werbung und Analyse</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Im Service werden keine Werbung und keine Analysen von Drittanbietern verwendet.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>8. Online-Shop</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Auf der Website kann ein Demonstrations-Online-Shop angezeigt werden, der keine realen Verkäufe tätigt und keine Zahlungsdaten verarbeitet.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>9. Löschung von Konto und Daten</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Wir respektieren Ihr Recht auf Vergessenwerden.{"\n"}
          • **In-App-Löschung:** Sie können Ihr Konto und alle damit verbundenen Daten (Profil, Käse-Chargen, Kommentare) permanent löschen, indem Sie in Ihren Profileinstellungen auf „Account löschen“ klicken.{"\n"}
          • **Manueller Antrag:** Alternativ können Sie die Löschung per E-Mail an die auf der Website angegebenen Kontakte beantragen.{"\n"}
          • **Datenbereinigung:** Nach der Löschung werden Ihre Daten unwiderruflich aus unserer aktiven Datenbank entfernt.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>10. Zweck des Projekts</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Der Service ist ein Bildungsprojekt, das zum Zweck der Erlernung der Entwicklung von Websites und mobilen Apps erstellt wurde.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>11. Änderungen der Richtlinie</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Wir können diese Datenschutzerklärung periodisch aktualisieren. Die aktuelle Version ist immer auf dieser Seite verfügbar.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>12. Kontakt</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Wenn Sie Fragen zu dieser Datenschutzerklärung haben, können Sie uns über die auf der Website angegebenen Kontaktinformationen kontaktieren.
        </Text>

        <Text className="text-lg font-bold mt-5 mb-2" style={{ color: colors.tint }}>13. Moderation von Nutzerinhalten (UGC)</Text>
        <Text className="text-base leading-6" style={{ color: colors.text }}>
          Um eine sichere Umgebung für alle Nutzer zu gewährleisten, überwachen wir öffentlich geteilte Inhalte:{"\n"}
          • **Meldemechanismus:** Nutzer können unangemessene Inhalte über die „Melden“-Schaltfläche (Flaggen-Symbol) direkt in der App melden.{"\n"}
          • **Reaktionszeit:** Wir prüfen jede Meldung innerhalb von 24 Stunden.{"\n"}
          • **Maßnahmen:** Inhalte, die gegen unsere Richtlinien verstoßen (z. B. Spam, Beleidigungen), werden entfernt. Nutzer, die wiederholt gegen Regeln verstoßen, können blockiert werden.
        </Text>

        <Text className="text-sm italic mt-8 pt-5 border-t border-gray-200" style={{ color: colors.icon }}>
          Durch die Nutzung der Käse mit Liebe App oder Website stimmen Sie dieser Datenschutzerklärung zu.
        </Text>
      </ScrollView>
    </View>
  );
}
