import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getAccessToken() {
  const res = await fetch(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        order_items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 
    const itemsTotal = order.order_items.reduce((sum, item) => {
      return sum + Number(item.unit_price)*item.quantity;
    }, 0);

  
    const delivery = Number(order.delivery_price ?? 0);

   
    const total = itemsTotal + delivery;

   
    const totalString = total.toFixed(2);

    const accessToken = await getAccessToken();

    const paypalRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: String(orderId),
              amount: {
                currency_code: "EUR",
                value: totalString,
                breakdown: {
                  item_total: {
                    currency_code: "EUR",
                    value: itemsTotal.toFixed(2),
                  },
                  shipping: {
                    currency_code: "EUR",
                    value: delivery.toFixed(2),
                  },
                },
              },
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order=${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel?order=${orderId}`,
          },
        }),
      }
    );

    const paypalOrder = await paypalRes.json();

    const approvalUrl = paypalOrder.links?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (l: any) => l.rel === "approve"
    )?.href;

    return NextResponse.json({ approvalUrl });
  } catch (err) {
    console.error("PayPal create order error:", err);
    return NextResponse.json(
      { error: "PayPal order creation failed" },
      { status: 500 }
    );
  }
}
