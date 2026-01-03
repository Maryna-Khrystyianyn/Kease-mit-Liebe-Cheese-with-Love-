import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
    const { id } = await params;
    const recipeId = Number(id);

  if (isNaN(recipeId)) {
    return NextResponse.json(
      { message: "Invalid recipe id" },
      { status: 400 }
    );
  }

  try {
    const batches = await prisma.cheese_batches.findMany({
      where: {
        recipe_id: recipeId,
        ispublic: true,
        foto: {
          not: null,
        },
      },
      select: {
        id: true,
        foto: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Fehler beim Laden der Bilder" },
      { status: 500 }
    );
  }
}
