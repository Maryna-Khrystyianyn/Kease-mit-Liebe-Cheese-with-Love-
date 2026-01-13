"use client";

import { useState } from "react";
import { LayoutIcon, ArrowBigLeft } from "lucide-react";
import { ProductForClient } from "@/types/global";
import { useCart } from "@/app/context/CartContext";
import { toast } from "react-toastify";
import PageWrapper from "@/app/PageWraper";

interface Props {
  products: ProductForClient[];
}

export default function RandomProductsSidebar({ products }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const { addItem } = useCart();

  return (
    <div className="relative md:flex hidden">
      <div
        className={`
          transition-all duration-500 ease-in-out border-(--olive)
          ${isOpen ? "w-72 p-4" : "w-12 p-1 flex justify-center border-r"}
        `}
      >
        {/* Toggle button */}
        <button
          className={`
            absolute top-6 left-full
            transform -translate-x-1/2
            text-(--olive_bright) bg-(--bg) p-1 rounded
            side-bar-button-shadow hover:bg-(--orange) transition
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ArrowBigLeft size={20} /> : <LayoutIcon size={28} />}
        </button>

        {/* Sidebar content */}
        <div
          className={`
            transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h3 className="font-bold mb-3">Vielleicht gefällt Ihnen auch</h3>

          <div className="flex flex-col gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center p-3 gap-7 main-shadow"
              >
                <img
                  src={product.image_url || "/product.png"}
                  alt={product.name}
                  className="w-full h-25 object-cover rounded"
                />

                <div className="">
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.price} €</p>
                </div>
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
                  className="px-3 py-1 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange) text-sm"
                >
                  In den Warenkorb
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
