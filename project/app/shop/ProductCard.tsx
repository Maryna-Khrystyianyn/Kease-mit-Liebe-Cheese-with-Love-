"use client";

import { ProductForClient } from "@/types/global";



type ProductCardProps = {
    product:ProductForClient;
    isAdmin: boolean;
  };
  
  export default function ProductCard({ product, isAdmin }: ProductCardProps) {
    return (
      <div className="border rounded-lg shadow-sm bg-white relative">
        {!product.isPublic && isAdmin && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Чернетка
          </span>
        )}
  
        <img
          src={product.image_url || "/product.png"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
  
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
  
          <p className="text-sm text-gray-500 mb-2">
            {product.products_categories?.name}
          </p>
  
          <p className="font-bold text-lg mb-3">
            {product.price.toFixed(2)} €
          </p>
  
          {isAdmin ? (
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                Bearbeiten
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded">
                Löschen
              </button>
            </div>
          ) : (
            <button className="w-full px-4 py-2 bg-olive text-white rounded">
              In den Warenkorb
            </button>
          )}
        </div>
      </div>
    );
  }