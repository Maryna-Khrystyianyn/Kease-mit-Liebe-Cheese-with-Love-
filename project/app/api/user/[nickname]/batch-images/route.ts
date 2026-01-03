import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { nickname: string } }
) {
    const { nickname } = await params;
    

  if (!nickname) {
    return NextResponse.json(
      { message: "Invalid user nick" },
      { status: 400 }
    );
  }

  try {
    const batches = await prisma.cheese_batches.findMany({
      where: {
        user_nick: nickname,
        foto: {
          not: null,
        },
      },
      select: {
        id: true,
        foto: true,
        ispublic:true,
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
