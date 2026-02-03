"use client";
import { useState, useCallback, useEffect } from "react";
import Filters from "./Filters";
import OrdersTable from "./OrdersTable";

import Link from "next/link";
import { Order } from "@/types/global";

interface OrdersClientProps {
  perPage: number;
}

export default function OrdersClient({ perPage }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<{
    status: string;
    email: string;
    sort: "new" | "old";
  }>({
    status: "",
    email: "",
    sort: "new",
  });

  const [filterAll, setFilterAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / perPage);

  const loadOrders = useCallback(
    async (pageToLoad = 1, applyFilterAll = false) => {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("page", pageToLoad.toString());
      params.set("perPage", perPage.toString());
      params.set("sort", filters.sort);
      if (filters.status) params.set("status", filters.status);
      if (filters.email) params.set("email", filters.email);
      if (applyFilterAll) params.set("filterAll", "true");

      const res = await fetch(`/api/orders/archive?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedOrders: Order[] = data.orders.map((o: any) => ({
        id: o.id,
        email: o.email,
        price:
          Number(o.total_price) +
          Number(o.delivery_price) -
          (Number(o.discount) || 0),
        payment_method: o.payment_method,
        status: o.status,
        payment_status: o.payment_status,
        date: new Date(o.date).toISOString(),
      }));

      setOrders(formattedOrders);
      setTotal(data.total);
      setPage(data.page);
      setFilterAll(applyFilterAll);
      setLoading(false);
    },
    [filters, perPage]
  );

  
  useEffect(() => {
    const fetchFirstPage = async () => {
      await loadOrders(1, false);
    };
  
    fetchFirstPage();
  }, [loadOrders]);

  return (
    <div className="p-4 md:px-10 xl:px-15 space-y-4">
      <Link
        href={"/admin"}
        className="text-(--text_gray) text-[14px] link-underline "
      >{`Admin Panel > `}</Link>
      <h1 className="text-2xl font-bold mb-5 ">Archivierte Bestellungen</h1>

      <Filters
        filters={filters}
        setFilters={setFilters}
        onChange={() => loadOrders(1, false)} // застосовуємо фільтри без filterAll
      />

      {loading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : (
        <OrdersTable orders={orders} />
      )}

      {/* Pagination*/}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 items-center">
          <button
            disabled={page <= 1 || loading}
            onClick={() => loadOrders(page - 1, false)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Vorherige Seite
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => loadOrders(page + 1, false)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Nächste Seite
          </button>
        </div>
      )}
    </div>
  );
}
