"use client";

import { useState } from "react";
import { ArrowBigDown, ArrowBigUp, SlidersHorizontal } from "lucide-react";

interface MobileBatchesFilterProps {
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  search: string;
  setSearch: (q: string) => void;
  sort: "new" | "old";
  setSort: (s: "new" | "old") => void;
  onApply: () => void;
}

export default function MobileBatchesFilter({
  categories,
  selectedCategories,
  setSelectedCategories,
  search,
  setSearch,
  sort,
  setSort,
  onApply,
}: MobileBatchesFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategories([]);
    setSort("new");
    onApply();
  };

  return (
    <div className="md:hidden border-b border-(--olive) bg-(--bg) my-check">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} />
          <span className="font-bold text-xl">Filter</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-(--olive_bright)"
        >
          {isOpen ? <ArrowBigUp size={22} /> : <ArrowBigDown size={22} />}
        </button>
      </div>

      {/* COLLAPSIBLE */}
      <div
        className={`
          overflow-hidden transition-all duration-700 ease-in-out
          ${isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-6 pb-6 space-y-6">
          {/* SEARCH */}
          <div>
          <p className="font-bold text-lg">Käsechargen nach Rezept suchen</p>
            <input
              type="text"
              placeholder="🔍 Suche nach Käse"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-(--green-orange) focus:outline-none focus:ring-2 focus:ring-(--green-orange)"
            />
          </div>

          <div className="flex justify-between  max-w-80">

{/* CATEGORIES */}
          <div>
            <p className="font-medium mb-2">Kategorie</p>
            {categories.map((cat) => (
              <label key={cat} className="flex gap-2 mb-1 items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>

          {/* SORT */}
          <div>
            <p className="font-medium mb-2">Sortierung</p>

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
            
          </div>

          

          {/* BUTTON Zurücksetzen */}
          <div className="flex gap-3 w-40">
            <button
              onClick={handleReset}
              className="flex-1 border border-(--olive) py-2 rounded "
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
