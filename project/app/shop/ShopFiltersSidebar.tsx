"use client";

import { useMemo, useState } from "react";
import { LayoutIcon, ArrowBigLeft } from "lucide-react";
import { ProductForClient } from "@/types/global";

type SortOption = "newest" | "oldest" | "priceAsc" | "priceDesc";

interface Props {
  products: ProductForClient[];
  search: string;
  setSearch: (v: string) => void;
  categoryId: number | null;
  setCategoryId: (v: number | null) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
}

export default function ShopFiltersSidebar({
  products,
  search,
  setSearch,
  categoryId,
  setCategoryId,
  sort,
  setSort,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const categories = useMemo(() => {
    return Array.from(
      new Map(
        products.map((p) => [p.products_categories.id, p.products_categories])
      ).values()
    );
  }, [products]);

  return (
    <div className="relative md:flex my-check hidden ">
      <div
        className={`
          transition-all duration-500 ease-in-out border-(--olive)
          ${isOpen ? "w-72 p-4 " : " w-12 p-1 flex justify-center border-r"}
        `}
      >
        <button
          className={`
            absolute top-6 left-full
            transform -translate-x-1/2
            text-(--olive_bright) bg-(--bg) p-1 rounded
            side-bar-button-shadow hover:bg-(--orange) transition
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ArrowBigLeft size={20} /> : <LayoutIcon size={28} />}
        </button>

        <div
          className={`
            transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <h3 className="font-bold mb-3">Filter</h3>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Produkt suchen..."
            className="w-full rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-(--green-orange) focus:outline-none focus:ring-2 focus:ring-(--green-orange)"
          />
          <p className="font-medium mt-5 mb-2">Kategorie</p>
          <select
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2 mb-4 border border-(--olive_bright) rounded"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="space-y-1">
            <p className="font-medium mt-5">Sortierung</p>
            <label className="flex gap-2 items-center">
              <input
                type="radio"
                checked={sort === "newest"}
                onChange={() => setSort("newest")}
                className="my-radio"
              />
              Neueste zuerst
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                className="my-radio"
                checked={sort === "oldest"}
                onChange={() => setSort("oldest")}
              />
              Älteste zuerst
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                className="my-radio"
                checked={sort === "priceDesc"}
                onChange={() => setSort("priceDesc")}
              />
              Teuer → Günstig
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                className="my-radio "
                checked={sort === "priceAsc"}
                onChange={() => setSort("priceAsc")}
              />
              Günstig → Teuer
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
