import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "../../../utils/auth";

//GET

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const batchId = Number(id);

  const batch = await prisma.cheese_batches.findUnique({
    where: { id: batchId },
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

  if (!batch) {
    return NextResponse.json({ message: "Nicht gefunden" }, { status: 404 });
  }

  // Якщо партія не публічна, перевіряємо користувача
  if (!batch.ispublic) {
    const user = await requireUser();
    if (batch.user_nick !== user.nick_name) {
      return NextResponse.json({ message: "Kein Zugriff" }, { status: 403 });
    }
  }

  return NextResponse.json(batch);
}

//PUT

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireUser();
  const { id } = await params;
  const batcheId = Number(id);

  const body = await req.json();
  const {
    recipe_id,
    description,
    cheeseweight,
    foto,
    ispublic,
    created_at,
    ready_at,
    milk_in_batch,
  } = body;

  const batch = await prisma.cheese_batches.findUnique({
    where: { id: batcheId },
  });

  if (!batch || batch.user_nick !== user.nick_name) {
    return NextResponse.json({ message: "403" }, { status: 403 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.cheese_batches.update({
      where: { id: batch.id },
      data: {
        recipe_id,
        description,
        cheeseweight,
        foto,
        ispublic,
        created_at: new Date(created_at),
        ready_at: new Date(ready_at),
      },
    });

    // видаляємо старе молоко
    await tx.milk_in_batch.deleteMany({
      where: { batch_id: batch.id },
    });

    // додаємо нове
    await tx.milk_in_batch.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: milk_in_batch.map((m: any) => ({
        batch_id: batch.id,
        milk_id: m.milk_id,
        amount: m.amount,
      })),
    });
  });

  return NextResponse.json({ success: true });
}

//DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const batcheId = Number(id);
  const user = await requireUser();
  const batch = await prisma.cheese_batches.findUnique({
    where: { id: batcheId },
  });

  if (!batch || batch.user_nick !== user.nick_name) {
    return NextResponse.json({ message: "403" }, { status: 403 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.milk_in_batch.deleteMany({
      where: { batch_id: batch.id },
    });

    await tx.cheese_batches.delete({
      where: { id: batch.id },
    });
  });

  return NextResponse.json({ success: true });
}
