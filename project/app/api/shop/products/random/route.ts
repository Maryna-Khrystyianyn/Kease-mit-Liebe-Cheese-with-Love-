import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { excludeIds, limit } = await req.json();

  const products = await prisma.products.findMany({
    where: {
      isPublic: true,
      id: { notIn: excludeIds || [] },
    },
  });

  const shuffled = products.sort(() => 0.5 - Math.random());
  return NextResponse.json(shuffled.slice(0, limit || 4));
}