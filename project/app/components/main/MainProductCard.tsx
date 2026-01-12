"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductForClient } from "@/types/global";

interface Props {
  product: ProductForClient;
}

export default function MainProductCard({ product }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="h-full pb-15"
    >
      <Link
        href={`/shop/products/${product.id}`}
        className="block h-full rounded-xl overflow-hidden bg-(--gray)  border-b-5 border-(--orange) hover:border-(--olive_bright) recipe-shadow"
      >
        {/* IMAGE */}
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={product.image_url||"/product.png"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* TITLE  adn PRICE*/}
        <div className="p-3">
          <p className="text-sm  text-center bg-(--gray) h-10">
            {product.name}
          </p>
          <div className="flex flex-col gap-3 mt-5">
            <span className="text-lg font-bold">{product.price}€</span>
            <button className="px-4 py-2 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)">
              In den Warenkorb
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
