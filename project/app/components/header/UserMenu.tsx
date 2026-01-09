"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookLock, ChevronDown, CookingPot, Heart, User, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserMenu({
  nick,
  username,
  avatar,
}: {
  nick: string;
  username: string;
  avatar: string | null;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    console.log("TRAY LogAut");
    await fetch(`${baseUrl}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  }
  return (
    <div className="relative flex gap-2" ref={menuRef}>
      <Link href={`/user/${nick}`}>
        <img
          src={avatar || "/user.png"}
          alt={`${username} avatar`}
          className="rounded-full shadow-xl object-cover border-2 border-(--olive_bright)  w-7 h-7"
        />
      </Link>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 sm:text-[22px] lg:text-[18px] opacity-60 hover:opacity-100"
      >
        <span className="sm:block hidden">{username}</span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 bg-gray-100  w-70 p-5 opacity-95 text-black flex flex-col gap-2">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-black opacity-60 hover:opacity-100"
          >
            <X size={20} />
          </button>

          {nick === "admin" && (
            <Link
              href={`/admin`}
              className="flex gap-3 link-underline w-[155px] items-end"
            >
              <BookLock size={25} className="text-(--orange) pb-1" />
              Admin Panel
            </Link>
          )}

          <Link
            href={`/user/${nick}`}
            className="flex gap-3 link-underline w-[155px] items-end"
          >
            <User size={25} className="text-(--orange) pb-1" />
            Profile
          </Link>
          <Link
            href={`/user/${nick}/favorite`}
            className="flex gap-3 link-underline w-[155px] items-end"
          >
            <Heart size={25} className="text-(--orange) pb-1" />
            Lieblingsrezepte
          </Link>
          <Link
            href={`/user/${nick}/batches`}
            className="flex gap-3 link-underline w-[185px] items-end"
          >
            <CookingPot size={25} className="text-(--orange) pb-1" />
            Meine Käsechargen
          </Link>

          <Link
            href={"/cheese-batches/add"}
            className="link-underline w-[220px] items-end text-(--olive_bright)"
          >
            Neue Käsecharge herstellen
          </Link>
          <button onClick={handleLogout} className="">
            <div className="block ml-40 pt-2 link-underline ">Logout</div>
          </button>
        </div>
      )}
    </div>
  );
}
