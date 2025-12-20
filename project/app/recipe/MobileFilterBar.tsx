"use client";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import ContentMobileFilterBar from "./ContentMobileFilterBar";

interface FilterState {
  category: string;
  milk: string;
  aging: string;
}

interface MobileFilterBarProps {
  categories: string[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onApply: () => void;
}

export default function MobileFilterBar({
  categories,
  filters,
  setFilters,
  onApply,
}: MobileFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden border-b border-(--olive) bg-(--bg) pt-4">
      {/* Заголовок + кнопка */}
      <div className="flex items-center justify-between px-6 py-2">
        <span className="font-bold text-[18px]">Filter</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-(--olive_bright) transition-transform duration-500"
        >
          {isOpen ? <ArrowBigUp size={22} /> : <ArrowBigDown size={22} />}
        </button>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          isOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ContentMobileFilterBar
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          onApply={onApply}
        />
      </div>
    </div>
  );
}
