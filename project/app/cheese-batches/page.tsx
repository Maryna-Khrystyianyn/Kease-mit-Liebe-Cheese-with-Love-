"use client";

import { useEffect, useState } from "react";
import type { Batch } from "@/types/global";
import { BatchPreview } from "./BatchPreview";
import PageWrapper from "../PageWraper";
import FilterBatchesSide from "./FilterBatchesSide";
import MobileBatchesFilter from "./MobileBatchesFilter";

const Tagebuch = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  //for Filter
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<"new" | "old">("new");

  // перший раз коли я завантажую сторінку з партіями сиру
  // я зчитую всі партії сиру і зразу знаходжу всі категорії
  // це я роблю один раз далі при фільтрації я категорії сиру не міняю
  // а роблю тільки уже залежно від того які фільтри вибрані запити до бази даних

  useEffect(() => {
    fetch(`/api/cheese-batches/publick`)
      .then((res) => res.json())
      .then((data: Batch[]) => {
        setBatches(data);
        const cats = Array.from(new Set(data.map((b) => b.recipeCategory)));
        setCategories(cats);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (selectedCategories.length)
      params.set("categories", selectedCategories.join(","));
    if (sort) params.set("sort", sort);

    fetch(`/api/cheese-batches/publick?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setBatches(data);
        setPage(1);
      });
  }, [search, selectedCategories, sort]);

  const totalPages = Math.ceil(batches.length / itemsPerPage);
  const paginatedBatches = batches.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <PageWrapper>
      <MobileBatchesFilter
        categories={categories}
        setSelectedCategories={setSelectedCategories}
        selectedCategories={selectedCategories}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        onApply={() => setPage(1)}
      />
      <div className="flex">
        <FilterBatchesSide
          categories={categories}
          setSelectedCategories={setSelectedCategories}
          selectedCategories={selectedCategories}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          onApply={() => setPage(1)}
        />

        {/* CONTENT */}
        <div className="w-full">
          <div className="max-w-6xl mx-auto flex flex-col gap-5 w-full">
            <h1 className="font-bold my-5 md:mx-0 mx-5">Das Käsetagebuch der Community</h1>
            <p className="text-(--text_gray) mb-10 italic lg:text-xl md:mx-0 mx-5">
              Hier teilen Hobby‑ und Haussennereien ihre Erfahrungen, kleine
              Erfolge und besondere Momente aus der Käseherstellung. Ein Ort, an
              dem jede*r festhalten kann, wie ein Käse entstanden ist, welche
              Rezepte begeistert haben und was man beim nächsten Mal vielleicht
              anders machen würde. Ein gemeinsames Tagebuch voller Inspiration,
              Austausch und echter Leidenschaft fürs Käsen.
            </p>
            {paginatedBatches.map((batch) => (
              <div key={batch.id} className="recipe-shadow ">
                <BatchPreview batch={batch} />
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
        </div>
      </div>
    </PageWrapper>
  );
};

export default Tagebuch;
