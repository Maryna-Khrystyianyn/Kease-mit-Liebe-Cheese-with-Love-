"use client";

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
      const res = await fetch(`/api/admin/orders/update`, {
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
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2">{order.id}</td>
      <td className="px-4 py-2">{order.email}</td>
      <td className="px-4 py-2">{(order.total_price + order.delivery_price - (order.discount || 0)).toFixed(2)}</td>
      <td className="px-4 py-2">{order.payment_method}</td>

      {/* STATUS */}
      <td className="px-4 py-2">
        <select
          value={order.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
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
          className="border border-gray-300 rounded px-2 py-1"
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
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {`>>>>`}
        </button>
      </td>
    </tr>
  );
}
