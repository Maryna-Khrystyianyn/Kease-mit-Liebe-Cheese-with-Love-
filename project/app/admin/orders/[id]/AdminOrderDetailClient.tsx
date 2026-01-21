"use client";

import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/Color";
import Link from "next/link";
import { useState } from "react";

const STATUS_OPTIONS = ["pending", "processing","shipped", "delivered", "cancelled", "refunded"];
const PAYMENT_STATUS_OPTIONS = ["pending", "invoice_sent", "paid", "refunded"];

export default function AdminOrderDetailClient({ order }: any) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const [comment, setComment] = useState(order.comment);

  const updateField = async (field: string, value: string) => {
    try {
      const res = await fetch(`/api/orders/update/${order.id}`, {
        cache: "no-store", 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, field, value }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error(err);
      alert("Error with update");
    }
  };

  const itemsTotal = order.items.reduce(
    (sum: number, i: any) => sum + i.quantity * i.unit_price,
    0
  );

  const grandTotal = itemsTotal + order.delivery_price;

  return (
    <div className="p-6 max-w-4xl mx-auto">
       <Link
        href={"/admin"}
        className="text-(--text_gray) text-[14px] link-underline "
      >{`Admin Panel > `}</Link>
       
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
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              updateField("status", e.target.value);
            }}
            className={`border border-(--gray_dunkel) rounded px-2 py-1 w-full ${ORDER_STATUS_COLORS[order.status]}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Zahlungsstatus</label>
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              updateField("payment_status", e.target.value);
            }}
            className={`border border-(--gray_dunkel) rounded px-2 py-1 w-full ${PAYMENT_STATUS_COLORS[order.payment_status]}`}
          >
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* coment */}
      <div className=" border border-(--olive_bright) rounded p-4 mb-6">
        <h2 className="font-bold mb-2">Kommentar</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={() => updateField("comment", comment)}
          className="w-full border border-(--gray_dunkel) rounded p-2"
          rows={3}
        />
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
            {order.items.map((item: any) => (
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
          <p className="font-bold">Alle zusammen: {grandTotal.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
}
