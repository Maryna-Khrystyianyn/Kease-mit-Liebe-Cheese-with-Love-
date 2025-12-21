"use client";

import { FormEvent } from "react";

interface SearchProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export default function Search({ value, onChange, onSubmit }: SearchProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="mx-3 my-1">
      <h3 className="font-bold text-lg">Rezept suchen</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-end">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="🔍 Käsesorte"
          className="w-full rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-(--green-orange) focus:outline-none focus:ring-2 focus:ring-(--green-orange)"
        />

        
      </form>
    </div>
  );
}
