
import { prisma } from "@/lib/prisma";
import AdminActiveOrdersClient from "./AdminActiveOrdersClient";
export const dynamic = "force-dynamic";



export default async function AdminActiveOrdersPage() {
  
  const orders = await prisma.orders.findMany({
    where: {
      status: { in: ["pending", "processing", "shipped"] },
    },
    include: {
      order_items: { include: { products: true } },
    },
    orderBy: { date: "desc" },
  });

 
  const formattedOrders = orders.map((o) => ({
    id: o.id,
    email: o.email,
    total_price: Number(o.total_price),
    delivery_price: Number(o.delivery_price),
    discount: o.discount ? Number(o.discount) : 0,
    payment_method: o.payment_method ?? "",
    status: o.status,
    payment_status: o.payment_status,
    date: o.date.toISOString(),
  }));

  return <AdminActiveOrdersClient initialOrders={formattedOrders} />;
}
