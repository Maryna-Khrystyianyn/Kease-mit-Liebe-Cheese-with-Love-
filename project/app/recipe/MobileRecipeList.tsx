"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types/global"; // твій тип User

interface Recipe {
  id: number;
  name: string;
  ispublic: boolean;
}

interface MobileRecipeListProps {
  id?: number; 
}

export default function MobileRecipeList({ id: activeId }: MobileRecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  useEffect(() => {
    //Get User
    fetch(`${baseUrl}/api/me`)
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(err => console.error("Error loading user:", err));

    // Get all Recipe
    fetch(`${baseUrl}/api/recipes`)
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error("Error loading recipes:", err));
  }, []);

  const isAdmin = user?.user_status === "admin";

  // filtr für recipe -> which are visible 
  const visibleRecipes = recipes.filter(r => r.ispublic || isAdmin);

  return (
    <ul className="flex text-[12px]  flex-wrap">
      {visibleRecipes.map(recipe => {
        const isActive = activeId === recipe.id;
        return (
          <li key={recipe.id}>
            <Link
              href={`/recipe/${recipe.id}`}
              className={`block px-4   link-underline 
                ${isActive ? "font-bold" : ""} ${recipe.ispublic?"text-(--text)":"italic text-(--olive_bright)"}`}
            >
              {recipe.name}
              
            </Link>
          </li>
        );
      })}
    </ul>
  );
}