"use client";
import { useState } from "react";

import { LayoutIcon, ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import BatchesList from "./BatchesList";


interface SidebarProps {
  nickName: string;
  username: string;
  avatar?: string | null;
  activeId: number;
}

export default function BatchSideBar({
  activeId,
  nickName,
  username,
  avatar,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative md:flex min-h-screen">
      <div
        className={`
           min-h-screen
          transition-all duration-500 ease-in-out border-(--olive)
          ${
            isOpen
              ? "w-72 p-4 "
              : "w-12 p-1 flex justify-center items-start border-r "
          }
        `}
      >
        {/* Toggle кнопка */}
        <button
          className={`
            absolute top-6  left-full
            transform md:-translate-x-1/2 text-(--olive_bright) bg-(--bg) p-1 rounded side-bar-button-shadow 
            hover:bg-(--orange) transition
            ${isOpen ? "ml-1" : ""}
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ArrowBigLeft size={20} /> : <LayoutIcon size={30} />}
        </button>

        {/* Вміст списку */}
        <div
          className={`
            transition-opacity duration-500 ease-in-out
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
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
          <BatchesList nickName={nickName} activeId={activeId} />
        </div>
      </div>
    </div>
  );
}
