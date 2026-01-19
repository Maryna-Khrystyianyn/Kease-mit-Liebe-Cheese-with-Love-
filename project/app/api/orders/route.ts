/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      user_nick,
      name,
      street,
      phone,
      zip,
      city,
      country,
      comment,
      cartItems,
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    //COUNT SUMME
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const delivery_price = subtotal > 100 ? 0 : 8;
    const total_price = subtotal + delivery_price;

    // CREATE ORDER
    const newOrder = await prisma.orders.create({
      data: {
        email,
        user_nick: user_nick || null,
        name,
        comment: comment || null,
        phone:phone||null,
        street,
        zip,
        city,
        country,
        delivery_price,
        total_price,
        order_items: {
          create: cartItems.map((item: any) => ({
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.price,
          })),
        },
      },
      include: { order_items: true },
    });

    return NextResponse.json({ order: newOrder });
  } catch (error: any) {
    console.error("ORDER API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
