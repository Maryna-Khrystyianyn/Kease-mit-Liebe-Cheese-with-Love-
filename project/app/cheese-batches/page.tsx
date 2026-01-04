import { Suspense } from "react";
import BatchesForm from "./BatchesForm";

export default function Page() {
  return (
    <Suspense fallback={<p>Lädt...</p>}>
      <BatchesForm/>
    </Suspense>
  );
}