"use client";
import { useEffect, useState } from "react";

interface FiltersProps {
  filters: { status: string; email: string; sort: "new" | "old" };
  setFilters: React.Dispatch<
    React.SetStateAction<{ status: string; email: string; sort: "new" | "old" }>
  >;
  onChange: () => void; 
}

export default function Filters({ filters, setFilters, onChange }: FiltersProps) {
  
  const [localEmail, setLocalEmail] = useState(filters.email);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localEmail !== filters.email) {
        setFilters(prev => ({ ...prev, email: localEmail }));
      }
    }, 300); 
    return () => clearTimeout(handler);
  }, [localEmail]);

 
  useEffect(() => {
    onChange();
  }, [filters.status, filters.sort, filters.email]); 

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 border-b border-gray-200 bg-(--bg) main-shadow ">
      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        className="p-2 border border-(--olive_bright) bg-(--bg) rounded focus:ring-1 focus:ring-(--green-orange)"
      >
        <option value="">Alle Status</option>
        <option value="delivered">delivered</option>
        <option value="cancelled">cancelled</option>
        <option value="refunded">refunded</option>
      </select>

      {/* email */}
      <input
        type="text"
        placeholder="🔍 Suche nach email"
        value={localEmail}
        onChange={(e) => setLocalEmail(e.target.value)}
        className="rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-(--green-orange) focus:outline-none focus:ring-2 focus:ring-(--green-orange)"
      />

      {/* new - old */}
      <div className="flex gap-2 items-center">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={filters.sort === "new"}
            onChange={() => setFilters(prev => ({ ...prev, sort: "new" }))}
            className="my-radio"
          />
          Neuer
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={filters.sort === "old"}
            onChange={() => setFilters(prev => ({ ...prev, sort: "old" }))}
            className="my-radio"
          />
          Älter
        </label>
      </div>
    </div>
  );
}
