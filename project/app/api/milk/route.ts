import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const milk = await prisma.ingredients.findMany({
    where: {
      name: {
        in: ["Kuhmilch", "Ziegenmilch", "Schafmilch"],
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(milk);
}
