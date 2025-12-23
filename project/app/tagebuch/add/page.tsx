"use client";

import RecipeSelector from "@/app/components/batsh/RecipeSelector";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import MilkSelector from "@/app/components/batsh/MilkSelector";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateBatchPage() {
  const [recipe, setRecipe] = useState<{ id: number; name: string } | null>(null);
  const [description, setDescription] = useState("");
  const [cheeseweight, setCheeseweight] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [milks, setMilks] = useState<{ milk_id: number; amount: number }[]>([]);

  // Обробка вибору файлу
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    // Завантаження на Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cheese_batches"); // твій upload preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      console.error("Fehler beim Hochladen des Bildes", err);
      alert("Fehler beim Hochladen des Bildes");
    }
  }

  async function handleSubmit(isPublic: boolean) {
    if (!recipe) {
      alert("Bitte Rezept auswählen");
      return;
    }

    // at least one milk selected
    if (milks.length === 0 || milks.some((m) => !m.amount)) {
      alert("Bitte wählen Sie mindestens eine Milchart mit Menge aus");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/cheese-batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipe_id: recipe.id,
        description,
        ispublic: isPublic,
        cheeseweight: cheeseweight ? Number(cheeseweight) : null,
        foto: imageUrl,
        milk_in_batch: milks,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Fehler beim Erstellen der Charge");
      return;
    }

    const data = await res.json();
    window.location.href = `/cheese-batch/${data.id}`;
  }

  return (
    <section className="max-w-4xl mx-auto p-6   bg-(--gray) rounded shadow ">
      <h1 className="text-2xl font-bold mb-4">Käsecharge erstellen</h1>

      {/* Recipe */}
      <RecipeSelector value={recipe} onSelect={setRecipe} />

      {/* Milk */}
      <MilkSelector value={milks} onChange={setMilks} />

      {/* Description */}
      <div className="mt-6">
<label className="font-medium ">Beschreibung</label>
      <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        className="mb-4 my-editor "
      />

      </div>
      

      {/* Gewicht */}
      <label className="font-medium ">Gewicht des hergestellten Käses</label>
      <input
        type="number"
        step="0.001"
        placeholder="Käsegewicht (kg)"
        className="w-full border border-(--olive) rounded p-2"
        value={cheeseweight}
        onChange={(e) => setCheeseweight(e.target.value)}
      />

      {/* Foto */}
      <img
        src={imageFile ? URL.createObjectURL(imageFile) : "/cheese.png"}
        alt="Avatar preview"
        className="w-50 h-50 bg-white rounded object-cover m-5"
      />
      <input
        type="file"
        id="cheeseFoto"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 hidden"
      />
      <label
        htmlFor="cheeseFoto"
        className="px-3 py-2 bg-(--orange) font-bold text-white rounded cursor-pointer hover:bg-(--olive_bright) transition"
      >
        Bild hochladen
      </label>

      <div className="flex gap-4 mt-10">
        <button
          onClick={() => handleSubmit(false)}
          className="px-6 py-3 bg-gray-400 text-white rounded"
        >
          Speichern
        </button>
        <button
          onClick={() => handleSubmit(true)}
          className="px-3 py-2  bg-(--olive_bright) font-bold text-white rounded cursor-pointer hover:bg-(--orange) transition"
        >
          Veröffentlichen
        </button>
      </div>
    </section>
  );
}
