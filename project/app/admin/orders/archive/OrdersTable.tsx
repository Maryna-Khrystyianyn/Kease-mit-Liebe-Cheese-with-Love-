"use client";

import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/Color";
import { Order } from "@/types/global";

import Link from "next/link";

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <table className="min-w-full bg-(--bg) border border-(--olive)">
      <thead className="bg-(--gray)">
        <tr>
          <th className="px-4 py-2 text-left">№</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Summe (€)</th>
          <th className="px-4 py-2 text-left">Zahlungsmethode</th>
          <th className="px-4 py-2 text-left"> Bestellstatus</th>
          <th className="px-4 py-2 text-left">Zahlungsstatus</th>
          <th className="px-4 py-2 text-left">Date</th>
          <th className="px-4 py-2 text-left">Details</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className="border-t border-(--gray) hover:bg-(--gray_dunkel)"
          >
            <td className="px-4 py-2">{order.id}</td>
            <td className="px-4 py-2">{order.email}</td>
            <td className="px-4 py-2">{(order.total_price + order.delivery_price - (order.discount || 0)).toFixed(2)}</td>
            <td className="px-4 py-2">{order.payment_method}</td>

            {/* STATUS */}
            <td className="px-4 py-2">
              <div
                className={`border border-(--olive_bright) bg-(--bg) rounded px-2 py-1 focus:ring-1 focus:ring-(--green-orange) ${
                  ORDER_STATUS_COLORS[order.status]
                }`}
              >
                {" "}
                {order.status}{" "}
              </div>
            </td>

            {/* PAYMENT_STATUS */}
            <td className="px-4 py-2">
              <div
                className={`border border-(--olive_bright) rounded px-2 py-1 bg-(--bg) focus:ring-1 focus:ring-(--green-orange) ${
                  PAYMENT_STATUS_COLORS[order.payment_status]
                }`}
              >
                {order.payment_status}
              </div>
            </td>

            <td className="px-4 py-2">
              {new Date(order.date).toLocaleDateString()}
            </td>

            <td className="px-4 py-2">
              <Link href={`/admin/orders/${order.id}`}
                className="text-(--olive_bright)  px-3 py-1 link-underline"
              >
                {`>>>>`}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
