"use client";

import { motion } from "framer-motion";

interface Recipe {
  id: number;
  name: string;
  description?: string;
  aging?: number | null;
  image?: string | null;
  ispublic: boolean;
  created_at: string;
  recipes_categories: { name: string };
}

interface RecipeItemProps {
  recipe: Recipe;
}

export default function RecipeItem({ recipe }: RecipeItemProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-(--bg) rounded  p-4 flex flex-col gap-3"
    >
     
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded"
        />
      )}

      {/* Назва рецепту */}
      <h2 className="text-xl font-bold">{recipe.name}</h2>

      {/* Категорія та тривалість визрівання */}
      <div className="text-sm text-(--text_gray) flex justify-between">
        <span>Kategorie: {recipe.recipes_categories?.name}</span>
        {recipe.aging && <span>Reifezeit: {recipe.aging} Tage</span>}
      </div>

      {/* Опис */}
      
        <div
          className="text-(--text)  prose max-w-none"
          
        >
            {recipe.description }
        </div>
      

      {/* Позначка для чернетки */}
      {!recipe.ispublic && (
        <div className="mt-2 inline-block px-2 py-1 text-xs font-bold bg-(--text) text-(--gray) rounded">
          ENTWURF
        </div>
      )}
    </motion.article>
  );
}