import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ingredients = await prisma.ingredients.findMany();
    return NextResponse.json(ingredients);
  } 
  catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { message: "Failed to load ingredients" },
      { status: 500 }
    );
  }
}