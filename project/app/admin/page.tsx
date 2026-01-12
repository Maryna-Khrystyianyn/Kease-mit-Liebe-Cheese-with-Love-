"use client";

import { useState } from "react";
import Link from "next/link";
import CreateCategoryModal from "./CreateCategoryModal";

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mx-5 md:mx-10">
      <h1 className="font-bold mb-4">Admin Panel</h1>

      <div className="space-y-2">
        <h2>Shop</h2>
        <div className="flex flex-col max-w-70 gap-3">
          <Link href="/shop/products/add" className="link-underline">
          ➕ Produkt hinzufügen
        </Link>

        <button
          onClick={() => setIsModalOpen(true)}
          className=" w-60 link-underline text-left"
        >
          ➕ Kategorie erstellen
        </button> 
        </div>
       
        <h2 className="mt-5">Rezepte</h2>
        <Link href="/recipe/add" className="  link-underline">
          ➕ Rezept hinzufügen
        </Link>
      </div>

      {isModalOpen && (
        <CreateCategoryModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
