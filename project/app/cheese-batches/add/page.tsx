"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateBatchForm from "./CreateBatchForm";
import type { User } from "@/types/global";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${baseUrl}/api/me`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  
  if (loading) {
    return <p className="text-center mt-10">Lädt…</p>;
  }

  // GAST
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <p className="text-xl my-14 font-semibold">
          Bitte registriere dich, um eine Käsecharge zu erstellen.
        </p>

        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)"
        >
          Zur Registrierung
        </button>
      </div>
    );
  }

  // AUTORISIERTER BENUTZER
  return (
    <Suspense fallback={<p>Lädt…</p>}>
      <CreateBatchForm />
    </Suspense>
  );
}