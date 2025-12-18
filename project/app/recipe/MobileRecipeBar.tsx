"use client";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import MobileRecipeList from "./MobileRecipeList";

interface SidebarProps {
  recipeId?: number;
}

export default function MobileRecipeBar({ recipeId }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="md:hidden pt-8 block border-b border-(--olive) bg-(--bg)">
     
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-[18px] font-bold">Alle Rezepte</span>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-(--olive_bright) transition-transform duration-500"
        >
          {isOpen ? <ArrowBigUp size={22} /> : <ArrowBigDown size={22} />}
        </button>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`
          overflow-hidden transition-all duration-700 ease-in-out
          ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-6 pb-4">
          <MobileRecipeList id={recipeId} />
        </div>
      </div>
    </div>
  );
}
