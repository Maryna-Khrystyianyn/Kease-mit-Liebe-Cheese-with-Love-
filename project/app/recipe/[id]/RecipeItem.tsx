"use client";
import { useEffect, useState } from "react";
import { User } from "@/types/global";
import Link from "next/link";
import RecipeBatchesCarousel from "@/app/components/batsh/RecipeBatchesCarousel";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecipeProps {
  recipe: {
    id: number;
    name: string;
    description?: string;
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  function cleanHtml(html: string) {
    return html.replace(/&nbsp;/g, " ").replace(/<p><br><\/p>/g, "");
  }

  useEffect(() => {
    fetch(`${baseUrl}/api/me`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch(`${baseUrl}/api/favorite-recipes/check?recipeId=${recipe.id}`)
      .then((res) => res.json())
      .then((data) => setIsFavorite(data.favorite));
  }, [user, recipe.id]);

  const isAdmin = user?.user_status === "admin";

  if (!recipe.ispublic && !isAdmin) {
    return (
      <p className="text-3xl text-center my-10">
        Rezept noch in der Entwicklung
      </p>
    );
  }

  const toggleFavorite = async () => {
    if (!user) {
      router.push("/register");
      return;
    }

    const res = await fetch(`${baseUrl}/api/favorite-recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: recipe.id }),
    });

    if (res.ok) {
      const data = await res.json();
      setIsFavorite(data.favorite);
    }
  };

  return (
    <article className="bg-(--bg) rounded main-shadow p-10">
      {/*  DRAFT LABEL */}
      {!recipe.ispublic && isAdmin && (
        <div className="mb-4 inline-block px-3 py-1 text-sm font-bold bg-black text-white rounded">
          ENTWURF
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex  gap-4">
         

          <button onClick={toggleFavorite} aria-label="favorite" className="pb-4">
            <Heart
              size={28}
              className={`transition ${
                isFavorite
                  ? "fill-(--orange) text-(--orange)"
                  : "text-gray-400 hover:text-(--orange)"
              }`}
            />
          </button>
          <h1 className="text-2xl font-bold mb-4">{recipe.name}</h1>
        </div>
        <Link
          href={{
            pathname: "/cheese-batches/add",
            query: { id: recipe.id, name: recipe.name, aging: recipe.aging },
          }}
          className="link-underline text-(--olive_bright) font-semibold block pb-2"
        >
          Käsecharge erstellen
        </Link>
      </div>

      <p className="text-sm text-(--text-gray) mb-2">
        Kategorie:
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
          className="w-full max-h-96 xl:max-h-130 object-cover rounded mb-4"
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
      <h3 className="my-3">{recipe.description}</h3>
      {recipe.body && (
        <div
          className="prose custom-list"
          dangerouslySetInnerHTML={{ __html: cleanHtml(recipe.body) }}
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

      <RecipeBatchesCarousel recipeId={recipe.id} />
    </article>
  );
}
