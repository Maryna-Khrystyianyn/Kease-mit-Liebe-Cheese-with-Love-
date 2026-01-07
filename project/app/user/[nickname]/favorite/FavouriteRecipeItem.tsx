"use client";

import { motion } from "framer-motion";

interface Props {
  recipe: {
    recipes_categories: { body: string | null; id: number; name: string };
  } & {
    body: string | null;
    image: string | null;
    id: number;
    name: string;
    aging: number | null;
    description: string | null;
    created_at: Date | null;
    ispublic: boolean | null;
    category_id: number;
  };
}

export default function FavouriteRecipeItem({ recipe }: Props) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-(--bg) rounded  p-4 flex flex-col gap-3 "
    >
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded"
        />
      )}

      <h2 className="text-xl font-bold">{recipe.name}</h2>

      <div className="text-sm text-(--text_gray) flex justify-between gap-1 flex-col md:flex-row">
        <span>
          {" "}
          <span className="font-semibold">Kategorie:</span>{" "}
          {recipe.recipes_categories?.name}
        </span>
        {recipe.aging && (
          <span>
            {" "}
            <span className="font-semibold">Reifezeit:</span> {recipe.aging}{" "}
            Tage
          </span>
        )}
      </div>

      {/* DESCRIPTION */}

      <div className="text-(--text) ">

        {recipe.description
          ? recipe.description.slice(0, 200) +
            (recipe.description.length > 200 ? "…" : "")
          : ""}{" "}
      </div>
    </motion.article>
  );
}
