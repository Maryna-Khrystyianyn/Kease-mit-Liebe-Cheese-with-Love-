import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  const body = await req.text(); 
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

 
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

   
    const order = await prisma.orders.findUnique({
      where: { stripe_session_id: session.id },
    });

    if (order) {
      await prisma.orders.update({
        where: { id: order.id },
        data: { payment_status: "paid" },
      });
      console.log(`Order ${order.id} marked as paid`);
    }
  }

  return NextResponse.json({ received: true });
}
