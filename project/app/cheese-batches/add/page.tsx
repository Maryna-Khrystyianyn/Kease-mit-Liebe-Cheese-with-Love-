"use client";  // це зробить всю сторінку client component

import CreateBatchForm from "./CreateBatchForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Lädt…</p>}>
      <CreateBatchForm />
    </Suspense>
  );
}