import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


//======GET============
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

//===POST============
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
      const { name, body: description } = body;
  
      if (!name || typeof name !== "string") {
        return NextResponse.json(
          { error: "Category name is required" },
          { status: 400 }
        );
      }
  
      const category = await prisma.products_categories.create({
        data: {
          name: name.trim(),
          body: description?.trim() || null,
        },
      });
  
      return NextResponse.json(category, { status: 201 });
    } catch (err) {
      console.error("Create category error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }