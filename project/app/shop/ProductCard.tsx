"use client";

import { ProductForClient } from "@/types/global";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toast } from "react-toastify";

type ProductCardProps = {
  product: ProductForClient;
  isAdmin: boolean;
};

export default function ProductCard({ product, isAdmin }: ProductCardProps) {
  const { addItem } = useCart();
  return (
    <div className="bg-(--bg) rounded main-shadow p-10 flex  flex-col justify-between recipe-shadow ">
      {/* INFO AND IMG */}
      <Link href={`/shop/products/${product.id}`}>
        {!product.isPublic && isAdmin && (
          <span className=" mb-4 inline-block px-3 py-1 text-sm font-bold bg-black text-white rounded">
            Entwurf
          </span>
        )}
        <h3 className="font-semibold text-lg mb-5">{product.name}</h3>
        <img
          src={product.image_url || "/product.png"}
          alt={product.name}
          className="w-full max-h-96 xl:max-h-130 object-cover rounded mb-4"
        />

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-2">
            {product.products_categories?.name}
          </p>

          <p className="font-bold text-lg mb-3">{product.price.toFixed(2)} €</p>
        </div>
      </Link>
      {/* BUTTONS */}
      <div>
        {isAdmin ? (
          <Link
            href={`/shop/products/${product.id}/edit`}
            className="px-4 py-2 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)"
          >
            Bearbeiten
          </Link>
        ) : (
            <button
                        onClick={() => {
                          addItem({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            image_url: product.image_url,
                          });
                          toast.success("Der Artikel ist jetzt in deinem Warenkorb.");
                        }}
                        className="px-4 py-2 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)"
                      >
                        In den Warenkorb
                      </button>
        )}
      </div>
    </div>
  );
}
