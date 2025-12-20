"use client";

interface FilterState {
  category: string;
  milk: string;
  aging: string;
}

interface FilterBarProps {
  categories: string[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onApply: () => void;
}

export default function FilterBar({
  categories,
  filters,
  setFilters,
  onApply,
}: FilterBarProps) {
  const resetFilters = () =>
    setFilters({ category: "", milk: "", aging: "" });

  return (
    <aside className="w-full md:w-64 space-y-6 p-4  rounded-lg bg-bg my-check text-sm">
      {/* CATEGORY */}
      <div>
        <p className="font-medium mb-2">Kategorie</p>

        <label className="flex gap-2 mb-1">
          <input
            type="checkbox"
            checked={filters.category === ""}
            onChange={() =>
              setFilters({ ...filters, category: "" })
            }
          />
          Alle
        </label>

        {categories.map((c) => (
          <label key={c} className="flex gap-2 mb-1">
            <input
              type="checkbox"
              checked={filters.category === c}
              onChange={() =>
                setFilters({ ...filters, category: c })
              }
            />
            {c}
          </label>
        ))}
      </div>

      {/* MILCK*/}
      <div>
        <p className="font-medium mb-2">Milch</p>

        <label className="flex gap-2 mb-1">
          <input
            type="checkbox"
            checked={filters.milk === ""}
            onChange={() =>
              setFilters({ ...filters, milk: "" })
            }
          />
          Alle
        </label>

        <label className="flex gap-2 mb-1">
          <input
            type="checkbox"
            checked={filters.milk === "cow"}
            onChange={() =>
              setFilters({ ...filters, milk: "cow" })
            }
          />
          Kuhmilch
        </label>

        <label className="flex gap-2 mb-1">
          <input
            type="checkbox"
            checked={filters.milk === "goat"}
            onChange={() =>
              setFilters({ ...filters, milk: "goat" })
            }
          />
          Ziegenmilch
        </label>
      </div>

      {/* Ripening */}
      <div>
        <p className="font-medium mb-2">Reifedauer</p>

        <label className="flex gap-2 mb-1">
          <input
            type="checkbox"
            checked={filters.aging === ""}
            onChange={() =>
              setFilters({ ...filters, aging: "" })
            }
          />
          Alle
        </label>

        {[
          { v: "lt10", l: "bis 10 Tage" },
          { v: "10-30", l: "10 – 30 Tage" },
          { v: "30-100", l: "30 – 100 Tage" },
          { v: "gt100", l: "über 100 Tage" },
        ].map(({ v, l }) => (
          <label key={v} className="flex gap-2 mb-1">
            <input
              type="checkbox"
              checked={filters.aging === v}
              onChange={() =>
                setFilters({ ...filters, aging: v })
              }
            />
            {l}
          </label>
        ))}
      </div>
      
      {/* BUTTONS */}
      <button
          onClick={resetFilters}
          className="flex-1 border-2 py-2 rounded-lg border-(--olive) w-full"
        >
          Reset
        </button>

      
      
    </aside>
  );
}