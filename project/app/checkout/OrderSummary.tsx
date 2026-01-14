"use client";

import { useCart } from "@/app/context/CartContext";

export default function OrderSummary() {
  const { cart } = useCart();

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  
  const shipping = subtotal > 100 ? 0 : 8;

  const total = subtotal + shipping;

  return (
    <div className="min-w-[250px] bg-(--gray) p-6 rounded-lg shadow space-y-4">
      <h3 className="font-bold text-lg">Bestellübersicht</h3>

      <ul className="space-y-5 border-b border-(--olive_bright) pb-5">
        {cart.items.map((item) => (
          <li
            key={item.productId}
            className="flex gap-2 justify-between text-sm"
          >
            <p className="md:w-[180px]">
              {item.name} × {item.quantity}
            </p>
            <p className="w-[70px] text-end">
              {(item.price * item.quantity).toFixed(2)} €
            </p>
          </li>
        ))}
      </ul>
<div className="flex justify-between font-bold">
    <span >Summa</span>
    <span >{subtotal} €</span>
</div>
      {/* Доставка */}
      <div className="flex justify-between text-sm">
        <span className="italic ">Versand</span>
        <span>{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} €`}</span>
      </div>
      <p className="text-(--orange) text-[11px]"> Ab einem Bestellwert von 100 € ist der Versand kostenlos.</p>
      <hr className="border-(--olive_bright)" />

      {/* Підсумок */}
      <div className="flex justify-between font-bold text-lg">
        <span>Gesamt</span>
        <span>{total.toFixed(2)} €</span>
      </div>
    </div>
  );
}
