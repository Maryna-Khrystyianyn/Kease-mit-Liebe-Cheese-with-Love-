import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { requireUser } from "@/app/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { recipeId } = await req.json();

    if (!recipeId) {
      return NextResponse.json({ error: "recipeId required" }, { status: 400 });
    }

    const existing = await prisma.favorite_recipes.findUnique({
      where: {
        recipe_id_user_nick: {
          recipe_id: recipeId,
          user_nick: user.nick_name,
        },
      },
    });

    // exist -> löschen
    if (existing) {
      await prisma.favorite_recipes.delete({
        where: {
          recipe_id_user_nick: {
            recipe_id: recipeId,
            user_nick: user.nick_name,
          },
        },
      });

      return NextResponse.json({ favorite: false });
    }

    // notexist -> hinzufügen
    await prisma.favorite_recipes.create({
      data: {
        recipe_id: recipeId,
        user_nick: user.nick_name,
      },
    });

    return NextResponse.json({ favorite: true });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
