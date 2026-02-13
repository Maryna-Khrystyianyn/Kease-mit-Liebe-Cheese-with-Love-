import PageWrapper from "@/app/PageWraper";

export default function PrivacyPolicyPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12 text-(--text)">
        <h1 className="text-4xl font-bold mb-8 text-(--olive_bright)">Datenschutzerklärung</h1>
        <p className="mb-4 font-semibold text-lg">Käse mit Liebe</p>
        <p className="mb-8 text-neutral-500">Letzte Aktualisierung: 12. Februar 2026</p>

        <section className="mb-8">
          <p className="mb-4">
            Diese Datenschutzerklärung beschreibt, wie die Käse mit Liebe App und Website (im Folgenden „Service“, „wir“, „unser“) Benutzerinformationen sammelt, verwendet und schützt.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">1. Welche Daten wir sammeln</h2>
          <p className="mb-2">Bei der Registrierung und Nutzung des Service können wir folgende Daten sammeln:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>E-Mail-Adresse (E-Mail)</li>
            <li>Passwort (verschlüsselt gespeichert)</li>
            <li>Telefonnummer (optional)</li>
            <li>Benutzerprofil-Daten</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">2. Wie wir Daten verwenden</h2>
          <p className="mb-2">Die gesammelten Daten werden verwendet für:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Erstellung und Verwaltung des Benutzerkontos</li>
            <li>Anmeldung im System</li>
            <li>Gewährleistung des Betriebs der App und Website</li>
            <li>Kontaktaufnahme mit dem Benutzer bei Bedarf</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">3. Profilanzeige</h2>
          <p className="mb-4">Die E-Mail des Benutzers kann im Profil angezeigt werden:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Wenn das Profil <strong>öffentlich</strong> ist, können andere Benutzer die E-Mail sehen.</li>
            <li>Wenn das Profil <strong>privat</strong> ist, sieht nur der Kontoinhaber die E-Mail.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">4. Wo Daten gespeichert werden</h2>
          <p className="mb-4">Die Daten werden auf sicheren Servern von Drittanbietern gespeichert:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Vercel (Hosting der Website)</li>
            <li>Neon (Datenbank)</li>
          </ul>
          <p className="mt-4">Wir ergreifen angemessene Maßnahmen, um Benutzerinformationen zu schützen.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">5. Weitergabe an Dritte</h2>
          <p>Wir verkaufen oder geben personenbezogene Daten nicht an Dritte weiter, außer in Fällen, die für den Betrieb des Service erforderlich sind.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">6. Werbung und Analyse</h2>
          <p>Im Service werden keine Werbung und keine Analysen von Drittanbietern verwendet.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">7. Online-Shop</h2>
          <p>Auf der Website kann ein Demonstrations-Online-Shop angezeigt werden, der keine realen Verkäufe tätigt und keine Zahlungsdaten verarbeitet.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">8. Löschung von Konto und Daten</h2>
          <p>Der Benutzer kann die Löschung seines Kontos und seiner personenbezogenen Daten beantragen, indem er uns über die auf der Website angegebenen Kontakte kontaktiert.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">9. Zweck des Projekts</h2>
          <p>Der Service ist ein Bildungsprojekt, das zum Zweck der Erlernung der Entwicklung von Websites und mobilen Apps erstellt wurde.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">10. Änderungen der Richtlinie</h2>
          <p>Wir können diese Datenschutzerklärung periodisch aktualisieren. Die aktuelle Version ist immer auf dieser Seite verfügbar.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-(--olive_bright)">11. Kontakt</h2>
          <p>Wenn Sie Fragen zu dieser Datenschutzerklärung haben, können Sie uns über die auf der Website angegebenen Kontaktinformationen kontaktieren.</p>
        </section>

        <p className="mt-12 pt-8 border-t border-(--olive_bright)/30 italic text-neutral-600">
          Durch die Nutzung der Käse mit Liebe App oder Website stimmen Sie dieser Datenschutzerklärung zu.
        </p>
      </div>
    </PageWrapper>
  );
}
