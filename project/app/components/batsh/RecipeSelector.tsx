"use client";

import { useEffect, useState } from "react";

interface Props {
  value: { id: number; name: string } | null;
  onSelect: (r: { id: number; name: string }) => void;
}

export default function RecipeSelector({ value, onSelect }: Props) {
  const [inputValue, setInputValue] = useState(value?.name || "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(value);

  useEffect(() => {
    //when we are not rendering
    if (inputValue.length < 2 || selectedRecipe?.name === inputValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/recipes?q=${inputValue}`);
      const data = await res.json();
      setResults(data);
      setOpen(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, selectedRecipe]);

  function handleSelect(r: { id: number; name: string }) {
    setSelectedRecipe(r);
    setInputValue(r.name);
    setResults([]);
    setOpen(false);
    onSelect(r);
  }

  return (
    <div className="relative">
      <label className="font-semibold mb-2">
        Rezept <span className="text-(--orange)">*</span>
      </label>
      <p className="text-sm text-(--text_gray)">
        Käserezept, nach dem diese Käsecharge hergestellt wurde
      </p>
      <input
        className="w-full border border-(--olive) rounded p-2"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSelectedRecipe(null); // when we edit the field, we reset the selection
          setOpen(true);
        }}
        placeholder="Rezeptname eingeben"
      />

      {open && results.length > 0 && (
        <ul className="absolute z-10 bg-(--bg) border w-full mt-1 rounded shadow">
          {results.map((r) => (
            <li
              key={r.id}
              className="p-2 hover:bg-(--gray) cursor-pointer"
              onClick={() => handleSelect(r)}
            >
              {r.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
