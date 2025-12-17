import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.recipes_categories.findMany();
    return NextResponse.json(categories);
  } 
  catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to load categories" },
      { status: 500 }
    );
  }
}