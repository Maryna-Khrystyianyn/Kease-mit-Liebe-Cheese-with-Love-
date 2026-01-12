"use client";

import { cleanHtml } from "@/app/utils/cleanHTML";
import { ProductForClient } from "@/types/global";
import { useState } from "react";

interface Props {
  product: ProductForClient;
}

export default function ProductView({ product }: Props) {
  const [qty, setQty] = useState(1);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* DESKTOP */}
      <div className="hidden md:grid grid-cols-2 gap-10">
        <img
          src={product.image_url || "/product.png"}
          alt={product.name}
          className="w-full rounded-lg object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-2">
            <span className="text-(--text)"> Kategorie: </span>{" "}
            {product.products_categories?.name}
          </p>
          <p className="text-2xl font-semibold mb-6">
            € {product.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 border border-(--olive_bright) rounded p-2"
            />

            <button className="px-4 py-2 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)">
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

        <img
          src={product.image_url || "/product.png"}
          alt={product.name}
          className="w-full rounded-lg mb-4"
        />
        <p className="text-sm text-gray-500 mb-2">
          <span className="text-(--text)"> Kategorie: </span>
          {product.products_categories?.name}
        </p>
        <p className="text-xl font-semibold mb-4">
          € {product.price.toFixed(2)}
        </p>

        <div className="flex items-center gap-3 mb-6">
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 border border-(--olive_bright) rounded p-2"
          />

          <button className="px-4 py-2 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)">
            In den Warenkorb
          </button>
        </div>
      </div>

      {/* DESCRIPTION */}
      {product.description && (
        <div className="mt-10 bg-(--gray) sm:p-10 p-5">
          <h2 className="text-xl font-semibold mb-3">Beschreibung</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: cleanHtml(product.description) }}
          />
        </div>
      )}
    </div>
  );
}
