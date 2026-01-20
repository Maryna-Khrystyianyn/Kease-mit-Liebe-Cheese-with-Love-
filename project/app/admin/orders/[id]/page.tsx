import { prisma } from "@/lib/prisma";
import AdminOrderDetailClient from "./AdminOrderDetailClient";

interface PageProps {
    params: Promise<{ id: string }>;
  }

export default async function AdminOrderDetailPage({ params }: PageProps) {
    const { id } = await params;
    const orderId = Number(id);

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      order_items: {
        include: { products: true },
      },
    },
  });

  if (!order) {
    return <div className="p-6">Bestellung nicht gefunden</div>;
  }

  const formattedOrder = {
    id: order.id,
    email: order.email,
    user_nick: order.user_nick,
    phone: order.phone,
    street: order.street,
    zip: order.zip,
    city: order.city,
    country: order.country,
    comment: order.comment || "",
    status: order.status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    date: order.date.toISOString(),
    delivery_price: Number(order.delivery_price),
    total_price: Number(order.total_price),
    items: order.order_items.map((i) => ({
      id: i.id,
      name: i.products.name,
      quantity: i.quantity,
      unit_price: Number(i.unit_price),
    })),
  };

  return <AdminOrderDetailClient order={formattedOrder} />;
}
