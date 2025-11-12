"use client";
import { useState, useEffect, useRef } from "react";
import NavMobile from "./NavMobile";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закриття меню при кліку поза
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Кнопка бургер/стрілка */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group pl-4  mt-1 flex flex-col justify-center items-center gap-1.5 transition-transform duration-300
        ${isOpen ? "rotate-180" : ""}`}
      >
        {/* 3 лінії бургер */}
        <span className="block w-6 h-0.5 bg-(--text) group-hover:bg-[#F4B619] transition-transform duration-300 group-hover:rotate-45 group-hover:translate-y-[12px] group-hover:translate-x-[-7px] group-hover:w-3" />
        <span className="block w-6 h-0.5 bg-(--text) group-hover:bg-[#F4B619] " />
        <span className="block w-6 h-0.5 bg-(--text) group-hover:bg-[#F4B619] transition-transform duration-300 group-hover:-rotate-45 group-hover:translate-y-[-12px] group-hover:translate-x-[-7px] group-hover:w-3" />
      </button>

      {/* Меню */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-70 bg-(--gray)  transform transition-transform duration-700
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
        className={`absolute top-4 text-2xl right-3 group w-8 h-8 transition-transform duration-300 
          ${!isOpen ? "rotate-180" : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <span className="block w-6 h-0.5 bg-(--text) group-hover:bg-[#F4B619] transition-transform duration-300 rotate-45 translate-y-[2px] group-hover:translate-x-[15px] group-hover:translate-y-[-2px] group-hover:w-3" />
        <span className="block w-6 h-0.5 bg-(--text) group-hover:bg-[#F4B619] opacity-0 group-hover:opacity-100" />
        <span className="block w-6 h-0.5 bg-(--text) group-hover:bg-[#F4B619] transition-transform duration-300 -rotate-45 translate-y-[-2px] group-hover:translate-x-[15px] group-hover:translate-y-[2px] group-hover:w-3" />
      </button>
        <NavMobile />
      </div>
    </div>
  );
};

export default BurgerMenu;
