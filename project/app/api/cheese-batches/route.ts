import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken, UserFromToken } from "../../utils/auth";









export async function POST(req: Request) {
  try {
    const user: UserFromToken | null = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Nicht autorisiert" }, { status: 401 });
    }

    

    if (!["basic", "admin"].includes(user.user_status)) {
      return NextResponse.json(
        { message: "Keine Berechtigung" },
        { status: 403 }
      );
    }

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

    if (!recipe_id || !created_at || !ready_at) {
      return NextResponse.json(
        { message: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const batch = await prisma.$transaction(async (tx) => {
      const newBatch = await tx.cheese_batches.create({
        data: {
          recipe_id,
          user_nick: user.nick_name,
          description,
          cheeseweight,
          foto,
          ispublic,
          date_batch: new Date(),
          created_at: new Date(created_at),
          ready_at: new Date(ready_at),
        },
      });
console.log("FOTO",foto)
      await tx.milk_in_batch.createMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: milk_in_batch.map((m: any) => ({
          batch_id: newBatch.id,
          milk_id: m.milk_id,
          amount: m.amount,
        })),
      });

      return newBatch;
    });

    return NextResponse.json({ id: batch.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Fehler beim Erstellen der Käsecharge" },
      { status: 500 }
    );
  }
}
