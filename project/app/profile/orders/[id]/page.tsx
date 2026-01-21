export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "../../../utils/auth";
import { redirect } from "next/navigation";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/Color";
import PageWrapper from "@/app/PageWraper";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailOrderPage({ params }: Props) {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/register");
  }
  const { id } = await params;
  const orderId = Number(id);

  const order = await prisma.orders.findFirst({
    where: {
      user_nick: user.nick_name,
      id: orderId,
    },
    include: {
      order_items: {
        include: {
          products: true,
        },
      },
    },
  });

  if (!order) {
    return <div>Bestelung nicht gefunden</div>;
  }

  const itemsTotal = order.order_items.reduce((sum, item) => {
    return sum + Number(item.unit_price) * item.quantity;
  }, 0);

  const delivery = Number(order.delivery_price || 0);
  const discount = Number(order.discount || 0);
  const grandTotal = itemsTotal + delivery - discount;

  return (
    <PageWrapper>
      <Link href={`/user/${user.nick_name}`} className="ml-10 mr-3 text-(--text_gray) text-[14px] link-underline ">{`Profil `}</Link>
      <Link href={`/user/${user.nick_name}/orders`} className="text-(--text_gray) text-[14px] link-underline ">{`Alle Bestellungen > `}</Link>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Bestellung № {order.id}</h1>

        {/* main info*/}
        <div className=" border border-(--olive_bright) rounded p-4 mb-6 space-y-2">
          <p>
            <b>Email:</b> {order.email}
          </p>
          <p>
            <b>Kunde:</b> {order.user_nick || "—"}
          </p>
          <p>
            <b>Telefon:</b> {order.phone || "—"}
          </p>
          <p>
            <b>Date:</b> {new Date(order.date).toLocaleString()}
          </p>
          <p>
            <b>Zahlungsmethode:</b> {order.payment_method}
          </p>
        </div>

        {/* Adress */}
        <div className="border border-(--olive_bright) rounded p-4 mb-6">
          <h2 className="font-bold mb-2">Lieferadresse</h2>
          <p>{order.name}</p>
          <p>{order.street}</p>
          <p>
            {order.zip} {order.city}
          </p>
          <p>{order.country}</p>
        </div>

        {/* Status */}
        <div className=" border border-(--olive_bright) rounded p-4 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Bestellstatus</label>
            <div
              className={`border border-(--gray_dunkel) rounded px-2 py-1 w-full ${
                ORDER_STATUS_COLORS[order.status]
              }`}
            >
              {order.status}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Zahlungsstatus</label>
            <div
              className={`border border-(--gray_dunkel) rounded px-2 py-1 w-full ${
                PAYMENT_STATUS_COLORS[order.payment_status]
              }`}
            >
              {order.payment_status}
            </div>
          </div>
        </div>

        {/* coment */}
        <div className=" border border-(--olive_bright) rounded p-4 mb-6">
          <h2 className="font-bold mb-2">Kommentar</h2>
          <div className="w-full border border-(--gray_dunkel) rounded p-2">
            {order.comment}
          </div>
        </div>

        {/* Bestellte Ware */}
        <div className=" border border-(--olive_bright) rounded p-4">
          <h2 className="font-bold mb-3">Bestellte Ware</h2>
          <table className="w-full border border-(--gray_dunkel)">
            <thead className="bg-(--gray)">
              <tr>
                <th className="px-3 py-2 text-left">Ware</th>
                <th className="px-3 py-2">Warenmenge</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Summa</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item: any) => (
                <tr key={item.id} className="border-t border-(--gray_dunkel)">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2 text-center">{item.quantity}</td>
                  <td className="px-3 py-2 text-right">
                    {item.unit_price.toFixed(2)} €
                  </td>
                  <td className="px-3 py-2 text-right">
                    {(item.quantity * item.unit_price).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 space-y-1">
            <p>Waren: {itemsTotal.toFixed(2)} €</p>
            <p>Lieferung: {order.delivery_price.toFixed(2)} €</p>
            <p className="font-bold">
              Alle zusammen: {grandTotal.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
