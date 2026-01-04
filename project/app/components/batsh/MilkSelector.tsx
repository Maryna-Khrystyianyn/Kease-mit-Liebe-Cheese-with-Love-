"use client";

import { useEffect, useState } from "react";

interface Milk {
  id: number;
  name: string;
}

interface SelectedMilk {
  milk_id: number;
  amount: number;
}

interface Props {
  value: SelectedMilk[];
  onChange: (val: SelectedMilk[]) => void;
}

export default function MilkSelector({ value, onChange }: Props) {
  const [milks, setMilks] = useState<Milk[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  useEffect(() => {
    fetch(`${baseUrl}/api/milk`)
      .then((r) => r.json())
      .then(setMilks);
  }, []);

  function toggleMilk(milk: Milk) {
    const exists = value.find((m) => m.milk_id === milk.id);

    if (exists) {
      onChange(value.filter((m) => m.milk_id !== milk.id));
    } else {
      onChange([...value, { milk_id: milk.id, amount: 0 }]);
    }
  }

  function updateAmount(milk_id: number, amount: number) {
    onChange(
      value.map((m) =>
        m.milk_id === milk_id ? { ...m, amount } : m
      )
    );
  }

  return (
    <div className="space-y-1 mt-6 my-check ">
      <p className="font-semibold mb-2">Milch auswählen <span className="text-(--orange)">*</span></p>

      {milks.map((milk) => {
        const selected = value.find((m) => m.milk_id === milk.id);

        return (
          <div
            key={milk.id}
            className="flex items-center gap-2  rounded px-3 w-65"
          >
            <input
              type="checkbox"
              checked={!!selected}
              onChange={() => toggleMilk(milk)}
            />

            <span className="flex-1  ">{milk.name}</span>

            {selected && (
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="Liter"
                className="w-20 border-b border-(--olive) text-center "
                value={selected.amount || ""}
                onChange={(e) =>
                  updateAmount(milk.id, Number(e.target.value))
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
