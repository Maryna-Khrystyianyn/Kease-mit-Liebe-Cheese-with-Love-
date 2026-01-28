import Image from "next/image";

export default function VersandPage() {
  return (
    <div className="flex flex-col mt-[-40px]">
      {/* Hero Image */}
      <div className="relative w-full h-[300px] md:h-[360px] lg:h-[420px]">
        <Image
          src="/delivery.png"
          alt="Lieferung Käse mit Liebe"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-12 prose prose-neutral">
        <h1>Versand- und Rückgabebedingungen</h1>

        <h2>Versand</h2>
        <ul>
          <li>
            Alle Bestellungen werden nach erfolgreicher Zahlung innerhalb von <strong>1–2 Werktagen</strong> über die <strong>Deutsche Post</strong> verschickt.
          </li>
          <li>
            Nach dem Versand erhalten Sie eine <strong>Versandbestätigung</strong> per E-Mail mit der Sendungsverfolgungsnummer.
          </li>
          <li>
            Lieferzeiten innerhalb Deutschlands betragen in der Regel <strong>2–5 Werktage</strong>, abhängig vom Postdienstleister.
          </li>
        </ul>

        <h2>Rückgabe und Widerruf</h2>
        <ul>
          <li>
            <strong>Versiegelte Produkte:</strong> Ungeöffnete Produkte können innerhalb von <strong>14 Tagen</strong> nach Erhalt zurückgegeben werden.
          </li>
          <li>
            <strong>Geöffnete Produkte:</strong> Für Produkte wie Starterkulturen, Bakterien oder andere lebende Kulturen gilt:
            <ul>
              <li>
                Einmal geöffnete oder verwendete Produkte <strong>können nicht zurückgegeben oder erstattet werden</strong>, da diese die Hygiene- und Sicherheitsanforderungen verletzen würden.
              </li>
            </ul>
          </li>
          <li>
            <strong>Rückgabeprozess:</strong>
            <ul>
              <li>Für eine Rückgabe kontaktieren Sie bitte unseren Kundenservice per E-Mail.</li>
              <li>Rücksendungen erfolgen auf eigene Kosten, es sei denn, das Produkt ist fehlerhaft oder beschädigt angekommen.</li>
            </ul>
          </li>
        </ul>

        <h2>Hinweise</h2>
        <ul>
          <li>Bitte überprüfen Sie bei der Lieferung die Unversehrtheit der Verpackung.</li>
          <li>Bei Beschädigungen oder falscher Lieferung wenden Sie sich sofort an unseren Kundenservice.</li>
          <li>
            Diese Regeln gelten insbesondere für lebende Kulturen, Starterkulturen und andere empfindliche Produkte, um Qualität und Sicherheit zu gewährleisten.
          </li>
        </ul>
      </section>
    </div>
  );
}
