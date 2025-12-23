import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface IngredientInput {
  ingredient_id: number;
  amount: number;
}

interface RecipeInput {
  name: string;
  body?: string;
  aging?: number;
  description?:string;
  category_id: number;
  ispublic: boolean;
  image?: string;
  ingredients: IngredientInput[];
}

export async function POST(req: Request) {
  try {
    const body: RecipeInput = await req.json();

    if (!body.name || !body.category_id || !body.ingredients?.length) {
      return NextResponse.json(
        { message: "Name, Kategorie und Zutaten sind erforderlich" },
        { status: 400 }
      );
    }

    // Create NEW RECIPE
    const newRecipe = await prisma.recipes.create({
      data: {
        name: body.name,
        body: body.body,
        description:body.description,
        aging: body.aging ?? null,
        category_id: body.category_id,
        ispublic: body.ispublic,
        image: body.image ?? null,
        // add in recipe_ingredients
        recipe_ingredients: {
          create: body.ingredients.map((i) => ({
            ingredient_id: i.ingredient_id,
            amount: i.amount,
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Rezept erstellt", recipe: newRecipe },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { message: "Fehler beim Erstellen des Rezepts", error: String(error) },
      { status: 500 }
    );
  }
}

//============ GET ========================================

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    const recipes = await prisma.recipes.findMany({
      where: query
        ? {
            name: {
              contains: query,
              mode: "insensitive", // пошук незалежно від регістру
            },
          }
        : undefined, // якщо query порожній, не застосовуємо фільтр
      orderBy: {
        created_at: "desc",
      },
      include: {
        recipe_ingredients: { include: { ingredients: true } },
        recipes_categories: true,
      },
    });

    if (!recipes || recipes.length === 0) {
      return NextResponse.json(
        { message: "Rezepten nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipes);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Fehler beim Abrufen den Rezepten" },
      { status: 500 }
    );
  }
}
