"use client";

import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

export default function CheckoutPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CheckoutForm />
        </div>

        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
