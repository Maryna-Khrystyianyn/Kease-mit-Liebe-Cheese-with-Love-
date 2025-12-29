"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface RecipeCarouselItemProps {
  id: number;
  name: string;
  imageUrl?: string | null;
}

export default function RecipeCarouselItem({
  id,
  name,
  imageUrl,
}: RecipeCarouselItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="h-full "
    >
      <Link
        href={`/recipe/${id}`}
        className="block h-full rounded-xl overflow-hidden bg-(--gray)  border-b-5 border-(--orange) hover:border-(--olive_bright)"
      >
        {/* IMAGE */}
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={imageUrl || "/cheese.png"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* TITLE */}
        <div className="p-3">
          <h3 className="text-sm sm:text-base font-bold text-center line-clamp-2 bg-(--gray)">
            {name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
