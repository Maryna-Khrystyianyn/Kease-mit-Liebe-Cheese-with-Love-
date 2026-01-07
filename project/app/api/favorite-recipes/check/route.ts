import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromToken } from "@/app/utils/auth";

export async function GET(req: NextRequest) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ favorite: false });
  }

  const recipeId = Number(req.nextUrl.searchParams.get("recipeId"));
  if (!recipeId) {
    return NextResponse.json({ favorite: false });
  }

  const existing = await prisma.favorite_recipes.findUnique({
    where: {
      recipe_id_user_nick: {
        recipe_id: recipeId,
        user_nick: user.nick_name,
      },
    },
  });

  return NextResponse.json({ favorite: Boolean(existing) });
}
