"use client";

import { useState } from "react";
import OrderRow from "./OrderRow";


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
  initialOrders: Order[];
};

export default function AdminActiveOrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateOrderField = (orderId: number, field: "status" | "payment_status", value: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, [field]: value } : o))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Aktive Bestellungen</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-(--bg) border border-gray-200">
          <thead className="bg-gray-100">
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
              <OrderRow key={order.id} order={order} updateOrderField={updateOrderField} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
