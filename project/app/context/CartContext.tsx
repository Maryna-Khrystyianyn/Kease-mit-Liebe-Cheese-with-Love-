"use client";

import { Cart, CartItem } from "@/types/global";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cart: Cart;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "shop_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] });

//== SYNHRONIZIREN WITH LOCALSTORAGE =============================
//================================================================

  // GET cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(JSON.parse(stored));
    }
  }, []);

  // SAVE  cart in localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

//=====================================================================
//=====================================================================

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId);

      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        items: [...prev.items, { ...item, quantity: 1 }],
      };
    });
  };

  const updateQuantity = (productId: number, qty: number) => {
    setCart((prev) => ({
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i
      ),
    }));
  };

  const removeItem = (productId: number) => {
    setCart((prev) => ({
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  const clearCart = () => setCart({ items: [] });


  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("Problem with CartContext");
  return ctx;
};
