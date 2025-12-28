import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    nickname: string;
  };
};

export async function GET(req: Request, { params }: Params) {
  const { nickname } = await params;

  const batches = await prisma.cheese_batches.findMany({
    where: {
      users: {
        nick_name: nickname,
      },
    },
    orderBy: {
      date_batch: "desc",
    },
    include: {
      recipes: {
        include: {
          recipes_categories: true,
        },
      },
      users: {
        select: {
          nick_name: true,
          username: true,
          avatar: true,
        },
      },
      milk_in_batch: {
        include: {
          ingredients: true,
        },
      },
    },
  });

  const result = batches.map((b) => ({
    id: b.id,
    image: b.foto,
    date: b.date_batch,
    isPublick: b.ispublic,
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

    isPublic: b.ispublic,

    user: {
      nickName: b.users.nick_name,
      username: b.users.username,
      avatar: b.users.avatar,
    },
  }));

  return NextResponse.json(result);
}
