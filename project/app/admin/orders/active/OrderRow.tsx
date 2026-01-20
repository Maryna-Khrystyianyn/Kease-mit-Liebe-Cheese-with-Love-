"use client";

import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/Color";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  email: string;
  total_price: number;
  delivery_price: number;
  discount?: number;
  payment_method: string;
  status: string;
  payment_status: string;
  date: string;
};

type Props = {
  order: Order;
  updateOrderField: (orderId: number, field: "status" | "payment_status", value: string) => void;
};

const STATUS_OPTIONS = ["pending", "processing","shipped", "delivered", "cancelled", "refunded"];

const PAYMENT_STATUS_OPTIONS = ["pending", "invoice_sent", "paid", "refunded"];

export default function OrderRow({ order, updateOrderField }: Props) {
  const router = useRouter();

  const handleChange = async (field: "status" | "payment_status", value: string) => {
    //save local
    updateOrderField(order.id, field, value);

    //save in DB
    try {
      const res = await fetch(`/api/orders/update/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, field, value }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error(err);
      alert("Error with update order");
    }
  };

  return (
    <tr className="border-t border-(--gray) hover:bg-(--gray_dunkel)">
      <td className="px-4 py-2">{order.id}</td>
      <td className="px-4 py-2">{order.email}</td>
      <td className="px-4 py-2">{(order.total_price + order.delivery_price - (order.discount || 0)).toFixed(2)}</td>
      <td className="px-4 py-2">{order.payment_method}</td>

      {/* STATUS */}
      <td className="px-4 py-2">
        <select
          value={order.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className={`border border-(--olive_bright) bg-(--bg) rounded px-2 py-1 focus:ring-1 focus:ring-(--green-orange) ${ORDER_STATUS_COLORS[order.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>

      {/* PAYMENT_STATUS */}
      <td className="px-4 py-2">
        <select
          value={order.payment_status}
          onChange={(e) => handleChange("payment_status", e.target.value)}
          className={`border border-(--olive_bright) rounded px-2 py-1 bg-(--bg) focus:ring-1 focus:ring-(--green-orange) ${PAYMENT_STATUS_COLORS[order.payment_status]}`}
        >
          {PAYMENT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>

      <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>

      <td className="px-4 py-2">
        <button
          onClick={() => router.push(`/admin/orders/${order.id}`)}
          className="text-(--olive_bright)  px-3 py-1 link-underline"
        >
          {`>>>>`}
        </button>
      </td>
    </tr>
  );
}
