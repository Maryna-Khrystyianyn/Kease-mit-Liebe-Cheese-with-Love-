import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const batchId = Number(id);
  
  try {
    const body = await req.json();
    const updated = await prisma.cheese_batches.update({
      where: { id: batchId },
      data: { onTimeLine: body.onTimeLine },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Timeline update error:", error);
    return NextResponse.json(
      { error: "Failed to update timeline status" },
      { status: 500 }
    );
  }
}
