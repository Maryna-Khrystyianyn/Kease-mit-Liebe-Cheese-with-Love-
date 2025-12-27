"use client"

import React, { useEffect, useState } from "react";
import type { Batch } from "@/types/global";
import { BatchPreview } from "./BatchPreview";



const Tagebuch = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

   useEffect(() => {
      fetch("/api/cheese-batches/publick")
        .then((res) => res.json())
        .then((data) => setBatches(data));
    }, []);

    const totalPages = Math.ceil(batches.length / itemsPerPage);
    const paginatedBatches = batches.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

  return <>
  <div className="max-w-6xl mx-auto p-6 flex flex-col gap-10 max-w">
    {paginatedBatches.map((batch) => (
      <div
        key={batch.id}
        
        className="recipe-shadow "
      >
        <BatchPreview batch={batch}/>
      </div>
    ))}
  </div>

  {/* PAGINATION */}
  {totalPages > 1 && (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (num) => (
          <button
            key={num}
            className={`px-3 py-1 rounded border ${
              num === page
                ? "bg-(--orange) text-white"
                : "bg-white text-(--text)"
            }`}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        )
      )}
    </div>
  )}
</>;
};

export default Tagebuch;
