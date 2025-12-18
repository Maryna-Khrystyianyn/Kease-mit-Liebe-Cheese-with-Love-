import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { t } from "i18next";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//============ GET ========================================

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const recipeId = Number(id);

    const recipe = await prisma.recipes.findUnique({
      where: { id: recipeId },
      include: {
        recipe_ingredients: { include: { ingredients: true } },
        recipes_categories: true,
      },
    });

    if (!recipe)
      return NextResponse.json(
        { message: "Rezept nicht gefunden" },
        { status: 404 }
      );
    //wenn das Rezept ein Entwurf ist (ispublic=false)
    /* if (!recipe.ispublic) {
    
      const cookieStore = await cookies();
      console.log("COOCIS",cookieStore)
      const token = cookieStore.get("token")?.value;
      //const token = (await cookieStore).get("token")?.value;
      console.log("NOT PUBLICK token - ",token)
      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }

      try {
        const payload = jwt.verify(token, JWT_SECRET) as {
          user_status: string;
        };

        if (payload.user_status !== "admin") {
          console.log("user Status",payload.user_status)  
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
      } catch (err) {
        return NextResponse.json({ message: "Invalid token" }, { status: 403 });
      }
    } */
    //return RECIPE
    return NextResponse.json(recipe);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Fehler beim Abrufen des Rezepts" },
      { status: 500 }
    );
  }
}

//================ PATCH =============================================

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = jwt.verify(token, JWT_SECRET);

    if (payload.user_status !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const recipeId = Number(id);
    const body = await req.json();

    const updatedRecipe = await prisma.recipes.update({
      where: { id: recipeId },
      data: {
        name: body.name,
        body: body.body ?? null,
        description: body.description ?? null,
        aging: body.aging ?? null,
        category_id: body.category_id,
        ispublic: body.ispublic,
        image: body.image ?? null,
        recipe_ingredients: {
          deleteMany: {},
          create: body.ingredients.map(
            (i: { ingredient_id: number; amount: number }) => ({
              ingredient_id: i.ingredient_id,
              amount: i.amount,
            })
          ),
        },
      },
      include: { recipe_ingredients: true },
    });

    return NextResponse.json({
      message: "Recipe updated",
      recipe: updatedRecipe,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error updating recipe", error: String(err) },
      { status: 500 }
    );
  }
}

//============ DELETE ==========================================================

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = jwt.verify(token, JWT_SECRET);

    if (payload.user_status !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const recipeId = Number(id);
    console.log("id for DELETE", recipeId);

    await prisma.recipe_ingredients.deleteMany({
      where: { recipe_id: recipeId },
    });
    await prisma.recipes.delete({ where: { id: recipeId } });

    return NextResponse.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error deleting recipe", error: String(err) },
      { status: 500 }
    );
  }
}
