export const runtime = "nodejs"; 

import { NextResponse } from "next/server";
import { generatePdf } from "@/app/utils/generatePdf";
import { sendMail } from "@/app/utils/sendMail";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: "No orderId provided" }, { status: 400 });
  }

  
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      order_items: {
        include: {
          products: true, 
        },
      },
    },

  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  
  const pdfBuffer = await generatePdf(order);

  await sendMail(order.email, pdfBuffer);

  await prisma.orders.update({
    where: { id: orderId },
    data: {
      payment_method: "Invoice",
      payment_status: "invoice_sent",
    },
  });

  return NextResponse.json({ success: true });
}
