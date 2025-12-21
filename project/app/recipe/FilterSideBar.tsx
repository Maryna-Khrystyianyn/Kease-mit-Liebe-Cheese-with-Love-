"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowBigLeft } from "lucide-react";
import FilterBar from "./FilterBar";
import Search from "./Search";

interface FilterSidebarProps {
  categories: string[];
  filters: {
    category: string;
    milk: string;
    aging: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilters: (f: any) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onApply: () => void;
}

export default function FilterSidebar({
  categories,
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  onApply,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative min-h-screen hidden md:flex">
      <div
        className={`
          min-h-screen
          transition-all duration-500 ease-in-out border-(--olive)
          ${
            isOpen
              ? "w-72 p-4"
              : "w-12 p-1 flex justify-center items-start border-r"
          }
        `}
      >
        {/* Toggle button */}
        <button
          className={`
            absolute top-6 left-full
            transform -translate-x-1/2
            text-(--olive_bright) bg-(--bg) p-1 rounded
            side-bar-button-shadow hover:bg-(--orange) transition
          `}
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
          className={`
            transition-opacity duration-500 ease-in-out
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={onApply}
          />
          <FilterBar
            categories={categories}
            filters={filters}
            setFilters={setFilters}
            onApply={onApply}
          />

          {/* RESET BUTTON*/}
      <button
          onClick={() => {
            setFilters({ category: "", milk: "", aging: "" });
            setSearchQuery("");
          }}
          className="flex-1 border-2 py-2 rounded-lg border-(--olive) w-full"
        >
          Reset
        </button>
        </div>
      </div>
    </div>
  );
}
