import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "../../../utils/paypal";

export async function POST(req: Request) {
  try {
    const { paypalOrderId, orderId } = await req.json();
    const numericOrderId = Number(orderId);

    if (isNaN(numericOrderId)) {
      return Response.json({ error: "Invalid orderId" }, { status: 400 });
    }

    const accessToken = await getAccessToken();
    console.log("ACcSESS TOCKEN", accessToken);
    //update ORDER
    const res = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.status === "COMPLETED") {
      const order = await prisma.orders.update({
        where: { id: numericOrderId },
        data: {
          payment_status: "paid",
          payment_method: "PayPal",
          status: "processing",
          paypal_order_id: paypalOrderId,
        },
      });

      console.log(`Order ${order.id} marked as paid via PayPal`);

      return NextResponse.json({ status: "ok", order });
    } else {
      console.warn("PayPal capture not completed:", data);
      return NextResponse.json({ status: "pending", data }, { status: 400 });
    }
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: "PayPal capture failed" },
      { status: 500 }
    );
  }
}
