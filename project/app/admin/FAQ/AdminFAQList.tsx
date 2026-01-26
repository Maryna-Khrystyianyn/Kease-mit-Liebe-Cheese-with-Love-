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
  { value: "LagerungTransportKulturen", label: "Lagerung / Transport / Kulturen" },
  { value: "KaseHerstellungNuancen", label: "Käseherstellung Nuancen" },
  { value: "KaseReifungLagerungNuancen", label: "Reifung / Lagerung Nuancen" },
  { value: "Andere", label: "Andere" },
];

export default function AdminFAQList({ faqs, refresh }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<FAQ | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [form, setForm] = useState({
    category: "",
    question: "",
    answer: "",
    tags: "",
  });

  // Accordion toggle
  const toggleOpen = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (faq: FAQ) => {
    setCurrentFAQ(faq);
    setForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      tags: faq.tags || "",
    });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentFAQ(null);
    setForm({ category: "", question: "", answer: "", tags: "" });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Möchten Sie dieses FAQ wirklich löschen?")) return;
    await fetch(`/api/faq/${id}`, { method: "DELETE" });
    refresh?.();
  };

  const handleSave = async () => {
    const method = currentFAQ ? "PUT" : "POST";
    const url = currentFAQ ? `/api/faq/${currentFAQ.id}` : `/api/faq`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags,
      }),
    });

    setModalOpen(false);
    refresh?.();
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
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={handleCreate}
            className="bg-(--green-orange) text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Neues FAQ erstellen
          </button>
        </div>

        {/* Радіо-фільтр */}
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center gap-1 text-sm cursor-pointer">
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
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <div className="text-sm text-(--olive_bright)">
                    {faq.category}
                  </div>
                  <div className="font-semibold">{faq.question}</div>
                </div>
                <span className="ml-2 text-gray-400">
                  {isOpen ? "▲" : "▼"}
                </span>
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

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="bg-(--olive_bright) text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Löschen
                    </button>
                  </div>
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

      {/* Модальне вікно */}
      {modalOpen && (
        <div className="fixed inset-0 bg-(--bg-transparent) flex justify-center items-center z-50">
          <div className="bg-(--bg) p-6 rounded main-shadow w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {currentFAQ ? "FAQ bearbeiten" : "Neues FAQ erstellen"}
            </h2>

            <select
              className="border border-(--olive) p-2 w-full mb-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Kategorie auswählen</option>
              <option value="ZahlungLieferung">Zahlung / Lieferung</option>
              <option value="LagerungTransportKulturen">
                Lagerung / Transport / Kulturen
              </option>
              <option value="KaseHerstellungNuancen">
                Käseherstellung Nuancen
              </option>
              <option value="KaseReifungLagerungNuancen">
                Reifung / Lagerung Nuancen
              </option>
              <option value="Andere">Andere</option>
            </select>

            <input
              type="text"
              placeholder="Frage"
              className="border border-(--olive) p-2 w-full mb-2"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />

            <textarea
              placeholder="Antwort"
              className="border border-(--olive) p-2 w-full mb-2"
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />

            <input
              type="text"
              placeholder="Tags (durch Komma getrennt)"
              className="border border-(--olive) p-2 w-full mb-4"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-300"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
