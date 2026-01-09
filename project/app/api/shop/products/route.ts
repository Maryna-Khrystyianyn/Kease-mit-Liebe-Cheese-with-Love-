import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name || !data.price || !data.category_id) {
      return NextResponse.json(
        { error: "Name, price and category_id are required" },
        { status: 400 }
      );
    }

    
    const newProduct = await prisma.products.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: data.price,
        category_id: data.category_id,
        avaible: data.avaible ?? true,
        isPublic: data.isPublic ?? false,
        image_url: data.image_url || null,
        image_id: data.image_id || null,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    console.error("Error creating product:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}