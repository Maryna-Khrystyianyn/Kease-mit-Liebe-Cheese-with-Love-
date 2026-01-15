import { Suspense } from "react";
import SuccessClient from "./success-client";


export const dynamic = "force-dynamic";

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <SuccessClient />
    </Suspense>
  );
}
