"use client";

import { useEffect, useState } from "react";
import RecipeItem from "./RecipeItem";
import { User } from "@/types/global";
import PageWrapper from "../PageWraper";
import Link from "next/link";
import FilterBar from "./FilterBar";
import FilterSideBar from "./FilterSideBar";
import MobileFilterBar from "./MobileFilterBar";

interface Recipe {
  id: number;
  name: string;
  description: string;
  aging?: number | null;
  image?: string | null;
  ispublic: boolean;
  created_at: string;
  recipes_categories: { name: string };
  recipe_ingredients: {
    ingredients: { name: string };
  }[];
}

function getMilkType(recipe: Recipe) {
  const ingredientNames = recipe.recipe_ingredients.map((ri) =>
    ri.ingredients.name.toLowerCase()
  );

  const hasCow = ingredientNames.some((n) => n.includes("kuh"));
  const hasGoat = ingredientNames.some((n) => n.includes("ziege"));

  if (hasCow && hasGoat) return "mixed";
  if (hasCow) return "cow";
  if (hasGoat) return "goat";
  return "unknown";
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    milk: "",
    aging: "",
  });

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

  //filter recipe
  const filteredRecipes = visibleRecipes.filter((r) => {
    if (filters.category && r.recipes_categories.name !== filters.category)
      return false;

    if (filters.milk) {
      const milkType = getMilkType(r);
      if (filters.milk === "cow" && milkType !== "cow" && milkType !== "mixed")
        return false;
      if (
        filters.milk === "goat" &&
        milkType !== "goat" &&
        milkType !== "mixed"
      )
        return false;
    }

    if (filters.aging && r.aging != null) {
      const a = r.aging;
      if (filters.aging === "lt10" && a >= 10) return false;
      if (filters.aging === "10-30" && (a < 10 || a > 30)) return false;
      if (filters.aging === "30-100" && (a < 30 || a > 100)) return false;
      if (filters.aging === "gt100" && a <= 100) return false;
    }

    return true;
  });

  //Categories
  const categories = Array.from(
    new Set(recipes.map((r) => r.recipes_categories.name))
  );

  // Pagination
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <PageWrapper>
      {/* MOBILE FILTER */}
      <div className="md:hidden  block">
        <MobileFilterBar
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          onApply={() => setPage(1)}
        />
      </div>

      <div className="flex">
        {/* FilterSideBar */}
        <FilterSideBar
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          onApply={() => setPage(1)}
        />

        {/* ALL RECIPE*/}
        <section className="max-w-6xl mx-auto p-6 space-y-8">
          <h1 className="text-3xl font-bold">Alle Rezepte</h1>

          <div className="grid gap-6 lg:grid-cols-2">
            {paginatedRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="recipe-shadow"
              >
                <RecipeItem recipe={recipe} />
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
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
                )
              )}
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
