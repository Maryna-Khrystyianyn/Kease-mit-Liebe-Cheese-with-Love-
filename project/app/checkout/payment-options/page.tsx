"use client";

import { useState } from "react";
import CheckoutForm from "./CheckoutForm"; // твоя форма з карткою
import { useRouter } from "next/navigation";

export default function PaymentOptions() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const router = useRouter();

  const handleSelection = (method: string) => {
    setSelectedMethod(method);
  };

  const handleSubmit = () => {
    if (selectedMethod === "stripe") {
      router.push("/checkout/stripe"); 
    } else if (selectedMethod === "paypal") {
      router.push("/checkout/paypal"); 
    } else if (selectedMethod === "invoice") {
      router.push("/checkout/invoice"); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-(--gray) rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Wähle die Zahlungsmethode</h1>

      <div className="flex flex-col gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="stripe"
            checked={selectedMethod === "stripe"}
            onChange={() => handleSelection("stripe")}
          />
          Zahlung per Karte (Stripe)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={selectedMethod === "paypal"}
            onChange={() => handleSelection("paypal")}
          />
          Zahlung über PayPal
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            value="invoice"
            checked={selectedMethod === "invoice"}
            onChange={() => handleSelection("invoice")}
          />
          Rechnung erhalten
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedMethod}
        className="px-6 py-3 bg-(--olive_bright) text-white rounded font-bold"
      >
        Weiter
      </button>
    </div>
  );
}
