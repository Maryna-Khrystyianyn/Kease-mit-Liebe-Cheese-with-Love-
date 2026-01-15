"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Lottie from "lottie-react";
import successAnimation from "../../../public/Success.json";

export default function Success() {
  const params = useSearchParams();
  const paypalOrderId = params.get("token");
  const orderId = params.get("order");

  useEffect(() => {
    if (!paypalOrderId || !orderId) return;

    fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paypalOrderId,
        orderId,
      }),
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
    
      <div className="flex justify-center items-center w-30 h-30 ">
        <Lottie animationData={successAnimation} loop={false} />{" "}
      </div>
      <h1 className="text-center "> Danke! Zahlung erfolgreich</h1>;
    </div>
  );
}
