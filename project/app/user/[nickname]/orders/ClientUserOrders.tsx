"use client";

import UserOrderRow from "./UserOrderRow";



export interface UserOrderListItem {
  id: number;
  date: string;
  total: number;
  status: string;
  payment_status: string;
}

export default function ClientUserOrders({
  orders,
}: {
  orders: UserOrderListItem[];
}) {
  return (
    <div className="p-6 md:p-10 xl:px-20">
      <h1 className="text-2xl font-bold mb-4">Meine Bestellungen</h1>

      <table className="max-w-200 w-full main-shadow">
        <thead>
          <tr className="bg-(--gray)">
            <th className="p-2 text-left">Datum</th>
            <th className="p-2 text-left">Summa</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <UserOrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
