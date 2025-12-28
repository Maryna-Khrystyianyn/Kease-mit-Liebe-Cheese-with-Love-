"use client";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Link from "next/link";
import MobileBatchesList from "./MobileBatchesList";

interface SidebarProps {
  nickName: string;
  username: string;
  avatar?: string | null;
  activeId: number;
}

export default function MobileRecipeBar({
  activeId,
  nickName,
  username,
  avatar,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="md:hidden pt-8 block border-b border-(--olive) bg-(--bg)">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="#">
          <div className="flex gap-5 items-center">
            {avatar && (
              <img
                src={avatar}
                alt={username}
                className="w-10 h-10 rounded-full object-cover border-2 border-(--orange)"
              />
            )}
            <p className="font-bold">{username}</p>
          </div>

          <h3 className="font-bold mb-3">Die letzte Käsecharge</h3>
        </Link>

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
          <MobileBatchesList nickName={nickName} activeId={activeId} />
        </div>
      </div>
    </div>
  );
}
