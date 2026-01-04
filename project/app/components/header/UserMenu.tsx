"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
  
  // Закриваємо меню при кліку поза ним
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
    await fetch(`${baseUrl}/api/logout`, { method: "POST", credentials: "include" });
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
        <button
          onClick={handleLogout}
          className="absolute right-0 top-8 bg-gray-100  w-32 text-black"
        >
          <div className="block px-4 py-2 link-underline ">Logout</div>
        </button>
      )}
    </div>
  );
}
