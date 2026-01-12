import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserStatus } from "@/app/utils/auth";



export async function PUT(req: NextRequest, { params }: { params:Promise<{ id: string }> }) {
  try {
     await requireUserStatus("admin");
    
        const { id } = await params;
        const productId = Number(id);
    

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      name,
      description,
      price,
      category_id,
      avaible,
      isPublic,
      image_url,
      image_id,
    } = body;

    const updatedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        name,
        description,
        price, 
        category_id,
        avaible,
        isPublic,
        image_url,
        image_id,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error("PUT product error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

