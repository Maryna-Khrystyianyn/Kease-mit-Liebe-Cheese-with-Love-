import { Suspense } from "react";
import RecipesForm from "./RecipesForm";

export default function Page() {
  return (
    <Suspense fallback={<p>Lädt...</p>}>
      <RecipesForm />
    </Suspense>
  );
}