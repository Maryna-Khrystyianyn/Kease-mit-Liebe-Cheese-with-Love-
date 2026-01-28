import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Truck,
  CreditCard,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-(--text) text-(--gray) px-6 py-12 mt-2">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* links*/}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-(--bg)">Navigation</h3>
          <ul className="space-y-2">
            <li>
              <Link href={"/recipe"} className="link-underline">Rezepte</Link>
            </li>
            <li>
            <Link href={"/shop"} className="link-underline">Shop</Link>
            </li>
            <li>
            <Link href={"/cheese-batches"} className="link-underline">Tagebuch</Link>
            </li>
            <li>
            <Link href={"/FAQ"} className="link-underline">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* contact*/}
        <div>
          <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span>svitlamarina@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span>+49 160 91448101</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span>Bautzen, Deutschland</span>
            </li>
          </ul>
        </div>

        {/* Delivery and payment */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Lieferung & Zahlung</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Truck className="w-5 h-5" />
              <Link href={"/delivery"} className="link-underline">Schnelle Lieferung in ganz Deutschland</Link>
            </li>
            <li className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <span>Visa, MasterCard, PayPal</span>
            </li>
          </ul>
        </div>
      </div>

      {/* copyright */}
      <div className="border-t border-(--olive_bright) mt-10 pt-6 text-center">
        <p className="text-sm text-neutral-400">
          © {new Date().getFullYear()} Käse mit Liebe.{" "}
          <Link
            href="https://portfolio-next-js-mu-wheat.vercel.app/"
            className="link-underline"
          >
            {" "}
            Maryna Khrystyianyn.
          </Link>
        </p>
      </div>
    </footer>
  );
}
