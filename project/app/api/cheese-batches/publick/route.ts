import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const categories = searchParams.get("categories")?.split(",") || [];
  const sort = searchParams.get("sort") || "new"; // new | old
  const batches = await prisma.cheese_batches.findMany({
    where: {
      ispublic: true,
      AND: [
        search
          ? {
              recipes: {
                name: { contains: search, mode: "insensitive" },
              },
            }
          : {},
        categories.length > 0
          ? {
              recipes: {
                recipes_categories: {
                  name: { in: categories },
                },
              },
            }
          : {},
      ],
    },
    orderBy: {
      date_batch: sort === "old" ? "asc" : "desc",
    },
    include: {
      recipes: { include: { recipes_categories: true } },
      users: {
        select: {
          nick_name: true,
          username: true,
          avatar: true,
        },
      },
      milk_in_batch: { include: { ingredients: true } },
    },
  });

  const result = batches.map((b) => ({
    id: b.id,
    image: b.foto,
    date: b.date_batch,

    recipeName: b.recipes.name,
    recipeId: b.recipe_id,
    agingDays: b.recipes.aging ?? 0,
    recipeCategory: b.recipes.recipes_categories.name,

    
    milkArray: b.milk_in_batch.map((m) => ({
      type: m.ingredients.name,
      amount: m.amount,
    })),

    cheeseWeight: b.cheeseweight ? Number(b.cheeseweight) : null,

    createdAt: b.created_at?.toISOString() ?? "",
    readyAt: b.ready_at?.toISOString() ?? null,

    description: b.description,

    user: {
      nickName: b.users.nick_name,
      username: b.users.username,
      avatar: b.users.avatar,
    },
  }));

  return NextResponse.json(result);
}
