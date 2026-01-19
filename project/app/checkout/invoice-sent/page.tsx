"use client"
import Lottie from "lottie-react";
import successAnimation from "../../../public/email.json";

export default function SuccessSend() {


  return (
    <div className="flex flex-col justify-center items-center mt-30">
      <div className="w-40 h-40">
        <Lottie animationData={successAnimation} loop={false} />
      </div>
      <h1 className="text-center mt-10">Vielen Dank für Ihre Bestellung! </h1>
      <p className="text-center text-xl p-10">Die Rechnung wurde Ihnen per E‑Mail zugesendet.  </p>
    </div>
  );
}