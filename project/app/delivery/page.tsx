import Image from "next/image";

export default function VersandPage() {
  return (
    <div className="flex flex-col mt-[-40px]">
      {/* Hero Image */}
      <div className="relative w-full h-[190px] sm:h-[300px] md:h-[340px] lg:h-[460px] xl:h-[500px] 2xl:h-[560px]">
        <Image
          src="/delivery.png"
          alt="Lieferung Käse mit Liebe"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Content */}
      <section className="xl:px-15 sm:px-6 px-3 py-12 prose prose-neutral">
        {/* Title*/}
        <h1 className="text-3xl font-bold mb-4 ">
          Versand- und Rückgabebedingungen
        </h1>
        {/* Content - section*/}
        <div className=" flex flex-col xl:flex-row xl:gap-10">
          <div className="main-shadow p-4 my-2">
            <h2 className="text-(--green-orange) font-bold">Versand</h2>
            <ul>
              <li>
                Alle Bestellungen werden nach erfolgreicher Zahlung innerhalb
                von <strong>1–2 Werktagen</strong> über die{" "}
                <strong>Deutsche Post</strong> verschickt.
              </li>
              <li>
                Nach dem Versand erhalten Sie eine{" "}
                <strong>Versandbestätigung</strong> per E-Mail mit der
                Sendungsverfolgungsnummer.
              </li>
              <li>
                Lieferzeiten innerhalb Deutschlands betragen in der Regel{" "}
                <strong>2–5 Werktage</strong>, abhängig vom Postdienstleister.
              </li>
            </ul>
          </div>

          <div className="main-shadow p-4 my-2">
            <h2 className="text-(--green-orange) font-bold">Rückgabe und Widerruf</h2>
            <ul>
              <li>
                <strong>Versiegelte Produkte:</strong> Ungeöffnete Produkte
                können innerhalb von <strong>14 Tagen</strong> nach Erhalt
                zurückgegeben werden.
              </li>
              <li>
                <strong>Geöffnete Produkte:</strong> Für Produkte wie
                Starterkulturen, Bakterien oder andere lebende Kulturen gilt:
                <ul>
                  <li>
                    Einmal geöffnete oder verwendete Produkte{" "}
                    <strong>
                      können nicht zurückgegeben oder erstattet werden
                    </strong>
                    , da diese die Hygiene- und Sicherheitsanforderungen
                    verletzen würden.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Rückgabeprozess:</strong>
                <ul>
                  <li>
                    Für eine Rückgabe kontaktieren Sie bitte unseren
                    Kundenservice per E-Mail.
                  </li>
                  <li>
                    Rücksendungen erfolgen auf eigene Kosten, es sei denn, das
                    Produkt ist fehlerhaft oder beschädigt angekommen.
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="main-shadow p-4 my-2">
          <h2 className="text-(--green-orange) font-bold">Hinweise</h2>
        <ul>
          <li>
            Bitte überprüfen Sie bei der Lieferung die Unversehrtheit der
            Verpackung.
          </li>
          <li>
            Bei Beschädigungen oder falscher Lieferung wenden Sie sich sofort an
            unseren Kundenservice.
          </li>
          <li>
            Diese Regeln gelten insbesondere für lebende Kulturen,
            Starterkulturen und andere empfindliche Produkte, um Qualität und
            Sicherheit zu gewährleisten.
          </li>
        </ul>
          </div>
        </div>

       
      </section>
    </div>
  );
}
