"use client";

import { Batch } from "@/types/global";
import Link from "next/link";
import BatchesItem from "./BatchesItem";
import { useState } from "react";

export default function MyBatchesForm({ batches }: { batches: Batch[] }) {
  const [search, setSearch] = useState("");

  /* Pagination */
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBatches = batches.filter((batch) =>
    batch.recipeName.toLowerCase().includes(search.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredBatches.length / ITEMS_PER_PAGE);
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="pt-8 sm:mx-10 mx-3">
      <div className=" flex justify-between gap-2 flex-col md:flex-row">
        <h1 className="font-bold"> Meine Käsechargen</h1>

        {/* SEARCH */}
        <div className="w-80 py-5">
          <p className="text-(--olive_bright)">
            Käsechargen nach Rezept suchen
          </p>
          <input
            type="text"
            placeholder="🔍 Suche nach Käse"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-(--green-orange) focus:outline-none focus:ring-2 focus:ring-(--green-orange)"
          />
        </div>
      </div>

      <div className=" grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        {paginatedBatches.map((b: Batch) => (
          <Link
          href={
            b.isPublick
              ? `/cheese-batches/${b.id}`
              : `/cheese-batches/edit/${b.id}`
          }
            key={b.id}
            className="recipe-shadow "
          >
            <BatchesItem batch={b} />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-(--text_gray) disabled:opacity-50 disabled:pointer-events-none disabled:no-underline  hover:text-(--text)  link-underline"
          >
            ← Zurück
          </button>

          <span className="text-(--olive_bright)">
            Seite <span className="font-bold">{currentPage}</span>  von {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-(--text_gray) disabled:opacity-50 disabled:pointer-events-none disabled:no-underline  hover:text-(--text)  link-underline"
          >
            Weiter →
          </button>
        </div>
      )}
    </div>
  );
}
