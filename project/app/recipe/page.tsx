"use client";

import { useEffect, useState } from "react";
import RecipeItem from "./RecipeItem";
import { User } from "@/types/global";
import PageWrapper from "../PageWraper";
import MobileRecipeBar from "./MobileRecipeBar";
import Link from "next/link";

interface Recipe {
  id: number;
  name: string;
  description: string;
  aging?: number | null;
  image?: string | null;
  ispublic: boolean;
  created_at: string;
  recipes_categories: { name: string };
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));

    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  const visibleRecipes = recipes.filter(
    (r) => r.ispublic || user?.user_status === "admin"
  );

  // Pagination
  const totalPages = Math.ceil(visibleRecipes.length / itemsPerPage);
  const paginatedRecipes = visibleRecipes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <PageWrapper>
      <section className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">Alle Rezepte</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {paginatedRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipe/${recipe.id}`} className="recipe-shadow">
              <RecipeItem recipe={recipe} />
            </Link>
          ))}
        </div>

        {/* Пагінація */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-3 py-1 rounded border ${
                  num === page
                    ? "bg-(--orange) text-white"
                    : "bg-white text-(--text)"
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
