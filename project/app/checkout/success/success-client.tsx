"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import successAnimation from "../../../public/Success.json";

export default function SuccessClient() {
  const params = useSearchParams();
  const paypalOrderId = params.get("token");
  const orderId = params.get("order");

  const capturedRef = useRef(false);

  useEffect(() => {
    if (!paypalOrderId || !orderId) return;
    if (capturedRef.current) return;

    capturedRef.current = true;

    fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paypalOrderId,
        orderId: Number(orderId),
      }),
    });
  }, [paypalOrderId, orderId]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-40 h-40">
        <Lottie animationData={successAnimation} loop={false} />
      </div>
      <h1 className="text-center">Danke! Zahlung erfolgreich 🎉</h1>
    </div>
  );
}
