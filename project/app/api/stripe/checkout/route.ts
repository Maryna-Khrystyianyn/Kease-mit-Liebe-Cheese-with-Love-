import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { orderId, items, deliveryPrice } = await req.json(); // отримуємо deliveryPrice

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // у центах
      },
      quantity: item.quantity,
    }));

    // Додаємо доставку як окремий line item, якщо deliveryPrice > 0
    if (deliveryPrice && deliveryPrice > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Versand / Lieferung",
          },
          unit_amount: Math.round(deliveryPrice * 100), // у центах
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel?order=${orderId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    return NextResponse.json({ error: "Stripe Checkout failed" }, { status: 500 });
  }
}
