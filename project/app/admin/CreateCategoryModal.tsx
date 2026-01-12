"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function CreateCategoryModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Name ist erforderlich");
      return;
    }

    setLoading(true);

    const res = await fetch(`${baseUrl}/api/shop/products/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, body }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Kategorie erstellt");
      onClose();
    } else {
      alert("Fehler beim Erstellen");
      console.error(await res.text());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Neue Kategorie</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Beschreibung (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          rows={3}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Abbrechen
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
