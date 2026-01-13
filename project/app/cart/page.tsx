"use client";

import { useEffect, useState } from "react";
import RandomProductsSidebar from "../components/products/RandomProductsSidebar";
import CartForm from "./CartForm";
import { useCart } from "@/app/context/CartContext";
import { ProductForClient } from "@/types/global";
import HorisontalRandomProducts from "../components/products/HorisontalRandomProdukts";
import PageWrapper from "../PageWraper";

export default function CartPage() {
  const { cart } = useCart();
  const [products, setProducts] = useState<ProductForClient[]>([]);

  useEffect(() => {
    async function fetchRandom() {
      const res = await fetch("/api/shop/products/random", {
        method: "POST",
        body: JSON.stringify({
          excludeIds: cart.items.map((i) => i.productId),
          limit: 4,
        }),
      });
      const data: ProductForClient[] = await res.json();
      setProducts(data);
    }

    fetchRandom();
  }, [cart.items]);

  return (
    <PageWrapper>
      <div className="p-6 flex md:flex-row flex-col gap-2">
        <RandomProductsSidebar products={products} />
        <CartForm />
        <HorisontalRandomProducts products={products} />
      </div>
    </PageWrapper>
  );
}
