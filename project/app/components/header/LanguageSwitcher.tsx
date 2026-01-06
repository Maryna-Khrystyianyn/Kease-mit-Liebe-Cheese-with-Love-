"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowDown } from "../icons/Arrows";
import { useTranslation } from "@/node_modules/react-i18next";
import "../../../lib/i18n";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language);
  const menuRef = useRef<HTMLDivElement>(null);
  

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: string) => {
    setLanguage(lang);
    i18n?.changeLanguage(lang);
    setIsOpen(false);
  };
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="flex gap-1 items-center font-bol link-underline hover:cursor-pointer "
      >
        {language === "de" ? "DE" : "УKR"}
        <span>{ArrowDown} </span>
      </button>

     
      {isOpen && (
        <div className="absolute mt-2 w-30 opacity-90 -right-10 border overflow-hidden border-(--gray) rounded-lg shadow-md z-10">
          <button
            onClick={() => handleSelectLanguage("de")}
            className={`block w-full text-left px-4 py-2 hover:bg-(--gray)`}
          >
            Deutsch
          </button>
          <button
            onClick={() => handleSelectLanguage("uk")}
            className={`block w-full text-left px-4 py-2 hover:bg-(--gray) `}
          >
            Українська
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
