import Link from "next/link";
import { UserOrderListItem } from "./ClientUserOrders";
import { ORDER_STATUS_COLORS } from "@/lib/Color";

export default function UserOrderRow({ order }: { order: UserOrderListItem }) {
  return (
    <tr className="border-t border-(--gray)">
      <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
      <td className="p-2">{order.total.toFixed(2)} €</td>
      <td>
        <div
          className={` text-center px-3 py-1 m-2 ${
            ORDER_STATUS_COLORS[order.status]
          } `}
        >
          {order.status}
        </div>
      </td>
      <td className="p-2 text-center">
        <Link
          href={`/profile/orders/${order.id}`}
          className="text-(--olive_bright) text-center link-underline"
        >
          {`>>>>`}
        </Link>
      </td>
    </tr>
  );
}
