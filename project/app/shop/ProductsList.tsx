"use client";

import { ProductForClient } from "@/types/global";
import ProductCard from "./ProductCard";

type ShopGridProps = {
  products: ProductForClient[];
  isAdmin: boolean;
};

export default function ProductsList({ products, isAdmin }: ShopGridProps) {
  if (products.length === 0) {
    return <p className="text-gray-500">Keine Produkte gefunden.</p>;
  }

  return (
    <div className="mx-5">
      <h1 className="font-bold mb-4">Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
