"use client";
import { useEffect, useState } from "react";
import { User } from "@/types/global";

interface RecipeProps {
  recipe: {
    id: number;
    name: string;
    body?: string;
    aging?: number;
    ispublic: boolean;
    image?: string;

    recipes_categories: {
      id: number;
      name: string;
      body?: string;
    };

    recipe_ingredients: {
      ingredient_id: number;
      amount: number;
      ingredients: {
        id: number;
        name: string | null;
        unit: string | null;
      };
    }[];
  };
}

export default function RecipeItem({ recipe }: RecipeProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);
  const isAdmin = user?.user_status === "admin";

  if (!recipe.ispublic && !isAdmin) {
    return <p className="text-3xl text-center my-10">Rezept noch in der Entwicklung</p>;
  }
  return (
    <article className="bg-(--bg) rounded main-shadow p-10">
      {/*  DRAFT LABEL */}
      {!recipe.ispublic && isAdmin && (
        <div className="mb-4 inline-block px-3 py-1 text-sm font-bold bg-black text-white rounded">
          ENTWURF
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">{recipe.name}</h1>

      <p className="text-sm text-(--text-gray) mb-2">
        Kategorie:{" "}
        <span className="font-semibold">{recipe.recipes_categories.name}</span>
      </p>

      {recipe.aging && (
        <p className="text-sm text-(--text-gray) mb-4">
          Reifezeit: <strong>{recipe.aging}</strong> Tage
        </p>
      )}

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full max-h-96 object-cover rounded mb-4"
        />
      )}

<section className="mb-6 max-w-md">
  <h2 className="text-lg font-bold mb-2">Zutaten</h2>

  <ul className="space-y-1">
    {recipe.recipe_ingredients.map((item) => (
      <li
        key={item.ingredient_id}
        className="flex justify-between border-b py-1 text-sm"
      >
        <span>{item.ingredients.name}</span>
        <span className="font-semibold">
          {item.amount} {item.ingredients.unit}
        </span>
      </li>
    ))}
  </ul>
</section>

      {recipe.body && (
        <div
          className="prose custom-list"
          dangerouslySetInnerHTML={{ __html: recipe.body }}
        />
      )}

      {/* 🛠 ADMIN ACTIONS */}
      {isAdmin && (
        <div className="mt-8 flex gap-4">
          <a
            href={`/recipe/edit/${recipe.id}`}
            className="px-4 py-2 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)"
          >
            Bearbeiten
          </a>

        </div>
      )}
    </article>
  );
}
