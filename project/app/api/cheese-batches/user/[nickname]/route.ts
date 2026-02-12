import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    nickname: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { nickname } = await params;
  const { searchParams } = new URL(req.url);
  
  const isPaging = searchParams.has("page") || searchParams.has("limit") || searchParams.has("search");
  
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "1000"); // high default for web
  const skip = isPaging ? (page - 1) * limit : 0;

  const where: any = {
    users: {
      nick_name: nickname,
    },
  };

  if (search) {
    where.recipes = {
      name: {
        contains: search,
        mode: 'insensitive'
      }
    };
  }

  const [batches, total] = await Promise.all([
    prisma.cheese_batches.findMany({
      where,
      orderBy: {
        date_batch: "desc",
      },
      skip,
      take: isPaging ? limit : undefined,
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
    }),
    prisma.cheese_batches.count({ where })
  ]);

  const result = batches.map((b) => ({
    id: b.id,
    image: b.foto,
    date: b.date_batch,
    isPublick: b.ispublic,
    onTimeLine: b.onTimeLine,
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

  if (isPaging) {
    return NextResponse.json({
      data: result,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  }

  return NextResponse.json(result);
}
