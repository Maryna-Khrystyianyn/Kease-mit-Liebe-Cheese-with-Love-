import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.products_categories.findMany({
      orderBy: { name: "asc" }, 
    });

    return NextResponse.json(categories);
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    console.error("Error fetching categories:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}