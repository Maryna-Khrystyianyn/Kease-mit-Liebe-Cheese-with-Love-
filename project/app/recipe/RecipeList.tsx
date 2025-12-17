"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types/global"; // твій тип User

interface Recipe {
  id: number;
  name: string;
  ispublic: boolean;
}

interface RecipeListProps {
  id?: number; // поточний відкритий рецепт
}

export default function RecipeList({ id: activeId }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Отримуємо користувача
    fetch("/api/me")
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(err => console.error("Error loading user:", err));

    // Отримуємо всі рецепти
    fetch("/api/recipes")
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error("Error loading recipes:", err));
  }, []);

  const isAdmin = user?.user_status === "admin";

  // Фільтруємо рецепти залежно від прав
  const visibleRecipes = recipes.filter(r => r.ispublic || isAdmin);

  return (
    <ul className="flex flex-col gap-2">
      {visibleRecipes.map(recipe => {
        const isActive = activeId === recipe.id;
        return (
          <li key={recipe.id}>
            <Link
              href={`/recipe/${recipe.id}`}
              className={`block px-2 py-1  link-underline text-(--text_gray)
                ${isActive ? "font-bold text-(--text)" : ""}`}
            >
              {recipe.name}
              {!recipe.ispublic && isAdmin && (
                <span className="ml-2 text-sm font-bold bg-(--text) text-(--bg) px-1 rounded">
                  ENTWURF
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}