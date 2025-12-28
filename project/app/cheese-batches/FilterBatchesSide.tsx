"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowBigLeft } from "lucide-react";

interface FilterBatchesSideProps {
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  search: string;
  setSearch: (q: string) => void;
  sort: "new" | "old";
  setSort: (s: "new" | "old") => void;
  onApply: () => void;
}

export default function FilterBatchesSide({
  categories,
  selectedCategories,
  setSelectedCategories,
  search,
  setSearch,
  sort,
  setSort,
  onApply,
}: FilterBatchesSideProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCategoryToggle = (cat: string) => {
    if (categories.includes(cat)) {
      setSelectedCategories(categories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...categories, cat]);
    }
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategories([]); 
    setSort("new");
  };

  return (
    <div className="relative min-h-screen hidden md:flex my-check">
      <div
        className={`min-h-screen transition-all duration-500 ease-in-out border-(--olive) ${
          isOpen
            ? "w-72 p-4"
            : "w-12 p-1 flex justify-center items-start border-r"
        }`}
      >
        {/* Toggle button */}
        <button
          className="absolute top-6 left-full transform -translate-x-1/2 text-(--olive_bright) bg-(--bg) p-1 rounded side-bar-button-shadow hover:bg-(--orange) transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ArrowBigLeft size={20} />
          ) : (
            <SlidersHorizontal size={22} />
          )}
        </button>

        {/* Content */}
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >

<h3 className="font-bold ">Filter</h3> 
          {/* Search */}
          <div className="my-4">
            <p className="font-bold text-lg">Käsechargen nach Rezept suchen</p>
            <input
              type="text"
              placeholder="🔍 Suche nach Käse"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-(--green-orange) focus:outline-none focus:ring-2 focus:ring-(--green-orange)"
            />
          
          </div>

          {/* Categories */}
          <div className="my-4">
            <p className="font-bold text-lg">Kategorie</p>
            {categories.map((cat) => (
              <label key={cat} className="flex gap-2 mb-1 items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)} 
                  onChange={() => {
                    if (selectedCategories.includes(cat)) {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== cat)
                      );
                    } else {
                      setSelectedCategories([...selectedCategories, cat]);
                    }
                  }}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Sort */}
          <div className="mb-4">
            <p className="font-bold text-lg">Sortierung</p>
            <label className="flex gap-2 mb-1 items-center">
              <input
                type="radio"
                checked={sort === "new"}
                onChange={() => setSort("new")}
            className="my-radio"
              />
              Neu → Alt
            </label>
            <label className="flex gap-2 mb-1 items-center">
              <input
                type="radio"
                checked={sort === "old"}
                onChange={() => setSort("old")}
                className="my-radio"
              />
              Alt → Neu
            </label>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex-1 border-2 py-2 rounded-lg border-(--olive) w-full"
          >
            Zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}
