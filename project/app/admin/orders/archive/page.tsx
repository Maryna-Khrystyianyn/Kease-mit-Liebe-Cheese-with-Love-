import { prisma } from "@/lib/prisma";
import OrdersClient from "./OrdersClient";
import PageWrapper from "@/app/PageWraper";
export const dynamic = "force-dynamic";

export interface Order {
  id: number;
  email: string;
  price: number;
  payment_method: string | null;
  status: string;
  payment_status: string;
  date: string;
}

export default async function ArchiveOrdersPage() {
  const perPage = 50;
  const page = 1;

  const rawOrders = await prisma.orders.findMany({
    where: { status: { in: ["delivered", "cancelled", "refunded"] } },
    orderBy: { date: "desc" },
    take: perPage,
  });

  const total = await prisma.orders.count({
    where: { status: { in: ["delivered", "cancelled", "refunded"] } },
  });

  const orders: Order[] = rawOrders.map((o) => ({
    id: o.id,
    email: o.email,
    price:
      Number(o.total_price) +
      Number(o.delivery_price) -
      (Number(o.discount) || 0),
    payment_method: o.payment_method,
    status: o.status,
    payment_status: o.payment_status,
    date: o.date.toISOString(),
  }));

  return (
    <PageWrapper>
      <OrdersClient
        initialOrders={orders}
        initialTotal={total}
        initialPage={page}
        perPage={perPage}
      />
    </PageWrapper>
  );
}
