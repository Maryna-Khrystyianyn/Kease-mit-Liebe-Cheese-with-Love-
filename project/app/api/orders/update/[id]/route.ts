import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { orderId, field, value } = await req.json();

    if (!orderId || !field) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (!["status", "payment_status", "comment"].includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    const updated = await prisma.orders.update({
      where: { id: orderId },
      data: { [field]: value },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
