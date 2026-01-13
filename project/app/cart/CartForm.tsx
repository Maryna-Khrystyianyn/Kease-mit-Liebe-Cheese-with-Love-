"use client";

import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/types/global";
import { Trash, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartForm() {
  const { cart, addItem, updateQuantity, removeItem, clearCart } = useCart();

  const handleIncrease = (productId: number, currentQty: number) => {
    updateQuantity(productId, currentQty + 1);
  };

  const handleDecrease = (productId: number, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      removeItem(productId);
    }
  };

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItemPrice = (item: CartItem) => {
    return item.price * item.quantity;
  };

  if (cart.items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="font-bold text-xl">Warenkorb</h1>
        <p className="mt-4">Dein Warenkorb ist leer.</p>
        <Link href="/shop" className="text-blue-600 underline">
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="2xl:w-6xl w-full mx-auto p-6 bg-(--gray)">
      <h1 className="font-bold text-2xl mb-6">Warenkorb</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 items-center border-b border-(--olive_bright) p-4"
          >
            {/* IMAGE */}
            <img
              src={item.image_url || "/product.png"}
              className="w-20 h-20 object-cover rounded"
              alt={item.name}
            />

            {/* NAME + PRICE + REMOVE */}
            <div className="flex-1">
              <p className="font-bold text-sm md:text-base">{item.name}</p>
              <p>{item.price.toFixed(2)} €</p>
            
              <button
                onClick={() => removeItem(item.productId)}
                className="text-(--orange) font-bold"
              >
                <Trash2 />
              </button>
            </div>

            {/* QUANTITY + TOTA ITEM PRICE*/}
            <div className="flex flex-col gap-3 items-center" >
              <div className="flex items-center gap-2">

                 <button
                onClick={() => handleDecrease(item.productId, item.quantity)}
                className="px-2 py-1 text-2xl font-bold text-(--olive_bright)"
              >
                -
              </button>
              <span className="border border-(--olive_bright) w-10 h-10 flex justify-center items-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleIncrease(item.productId, item.quantity)}
                className="px-2 py-1 text-2xl font-bold text-(--olive_bright)"
              >
                +
              </button>
              </div>
             
             <p className="text-xl font-bold"> {totalItemPrice(item).toFixed(2)} €</p> 

            </div>
          </div>
        ))}
      </div>

      {/* TOTAL + CHECKOUT */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Gesamt: {totalPrice.toFixed(2)} €</p>
        <Link
          href="/checkout"
          className="px-6 py-3 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)"
        >
          Bestellung abschließen
        </Link>
      </div>

      {/* CLEAR CART BUTTON */}
      <div className="mt-4">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Warenkorb leeren
        </button>
      </div>
    </div>
  );
}
