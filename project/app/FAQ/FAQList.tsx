"use client";

import { useState } from "react";

export type FAQ = {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags?: string | null;
};

type Props = {
  faqs: FAQ[];
  refresh?: () => void;
};

const CATEGORIES = [
  { value: "ALL", label: "Alle" },
  { value: "ZahlungLieferung", label: "Zahlung / Lieferung" },
  {
    value: "LagerungTransportKulturen",
    label: "Lagerung / Transport / Kulturen",
  },
  { value: "KaseHerstellungNuancen", label: "Käseherstellung Nuancen" },
  { value: "KaseReifungLagerungNuancen", label: "Reifung / Lagerung Nuancen" },
  { value: "Andere", label: "Andere" },
];

export default function FAQList({ faqs, refresh }: Props) {
 
  const [currentFAQ, setCurrentFAQ] = useState<FAQ | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

 

  // Accordion toggle
  const toggleOpen = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  

  // 🔍 Фільтрація по категорії
  const filteredFaqs =
    selectedCategory === "ALL"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <div>
      {/* Верхня панель: кнопка + фільтр */}
      <div className="mb-6">
      

        {/* Радіо-фільтр */}
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className="flex items-center gap-1 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="categoryFilter"
                value={cat.value}
                checked={selectedCategory === cat.value}
                className="my-radio"
                onChange={() => {
                  setSelectedCategory(cat.value);
                  setOpenId(null); // закрити відкритий accordion при зміні фільтра
                }}
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      {/* Список FAQ */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div key={faq.id} className="main-shadow rounded">
              {/* Заголовок */}
              <button
                onClick={() => toggleOpen(faq.id)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-(--gray)"
              >
                <div>
                  <div className="text-sm text-(--olive_bright)">
                    {faq.category}
                  </div>
                  <div className="font-semibold">{faq.question}</div>
                </div>
                <span className="ml-2 text-gray-400">{isOpen ? "▲" : "▼"}</span>
              </button>

              {/* Розгорнута частина */}
              {isOpen && (
                <div className="px-4 pb-4 text-(--text_gray)">
                  <div className="mt-2">{faq.answer}</div>

                  {faq.tags && faq.tags.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      Tags: {faq.tags}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-gray-400 text-sm">
            Keine FAQs in dieser Kategorie gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
