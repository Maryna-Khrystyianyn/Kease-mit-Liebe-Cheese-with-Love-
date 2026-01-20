"use client";
import { useMemo, useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import Link from "next/link";
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

export default function MobileShopfolter({
  products,
  search,
  setSearch,
  categoryId,
  setCategoryId,
  sort,
  setSort,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = useMemo(() => {
    return Array.from(
      new Map(
        products.map((p) => [p.products_categories.id, p.products_categories])
      ).values()
    );
  }, [products]);
  return (
    <div className="md:hidden pt-8 block border-b border-(--olive) bg-(--bg)">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/shop">
          <span className="text-[20px] font-bold">Filter</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-(--olive_bright) transition-transform duration-500"
        >
          {isOpen ? <ArrowBigUp size={22} /> : <ArrowBigDown size={22} />}
        </button>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`
          overflow-hidden transition-all duration-700 ease-in-out
          ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-6 pb-4">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Produkt suchen..."
            className="w-full my-1 rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-(--green-orange) focus:outline-none focus:ring-1 focus:ring-(--green-orange)"
          />
          <p className="font-medium mt-5 mb-2">Kategorie</p>
          <select
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2 mb-4 border border-(--olive_bright) bg-(--bg) rounded focus:ring-1 focus:ring-(--green-orange)"
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
