"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MilkSelector from "@/app/components/batsh/MilkSelector";
import { useParams, useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RecipeShort {
  id: number;
  name: string;
  aging?: number | null;
}

interface MilkItem {
  milk_id: number;
  amount: number;
}

function calculateReadyDate(start: string, days: number) {
  if (!start) return "";
  const d = new Date(start);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function EditBatchPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id;

  const [recipe, setRecipe] = useState<RecipeShort | null>(null);
  const [description, setDescription] = useState("");
  const [cheeseweight, setCheeseweight] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("/cheese.png");
  const [milks, setMilks] = useState<MilkItem[]>([]);
  const [batchDate, setBatchDate] = useState("");
  const [readyDate, setReadyDate] = useState("");
  const [agingDays, setAgingDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onTimeLine, setOnTimeLine] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  //=======================
  // ==Load batch==========

  useEffect(() => {
    async function fetchBatch() {
      const res = await fetch(`${baseUrl}/api/cheese-batches/${batchId}`);
      if (!res.ok) return;

      const batch = await res.json();
      const resUser = await fetch(`${baseUrl}/api/me`, { cache: "no-store" });
      const data = await resUser.json();
      const user = data.user;

      if (user.nick_name !== batch.user_nick) {
        router.push("/forbidden");
      }
      setDescription(batch.description || "");
      setCheeseweight(batch.cheeseweight?.toString() || "");
      setPreviewUrl(batch.foto || "/cheese.png");
      setMilks(
        (batch.milk_in_batch || []).map((m: any) => ({
          milk_id: m.milk_id,
          amount: Number(m.amount) || 0,
        }))
      );
      setBatchDate(batch.created_at ? new Date(batch.created_at).toISOString().split("T")[0] : "");
      setOnTimeLine(batch.onTimeLine);

      if (batch.recipe_id) {
        const recipeRes = await fetch(`${baseUrl}/api/recipes/${batch.recipe_id}`);
        if (!recipeRes.ok) return;
        const recipeData = await recipeRes.json();

        setRecipe({
          id: recipeData.id,
          name: recipeData.name,
          aging: recipeData.aging || 0,
        });

        setAgingDays(recipeData.aging || 0);
        setReadyDate(
          batch.created_at
            ? calculateReadyDate(batch.created_at, recipeData.aging || 0)
            : ""
        );
      }
    }

    fetchBatch();
  }, [batchId]);

  useEffect(() => {
    if (batchDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReadyDate(calculateReadyDate(batchDate, agingDays));
    }
  }, [batchDate, agingDays]);

  //=======================
  //===Image preview ======
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  //=======================
  //=== Save ==============
  async function handleSave(isPublic: boolean) {
    if (!batchDate) return alert("Bitte Herstellungsdatum auswählen");

    const validMilks = milks.filter((m) => m.amount && m.amount > 0);
    if (validMilks.length === 0) {
      return alert("Bitte wählen Sie mindestens eine Milchart mit einer Menge größer als 0 aus");
    }

    setLoading(true);

    let imageUrl: string | null = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "cheese");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dnxh3rklj/image/upload",
          { method: "POST", body: formData }
        );
        const data = await res.json();
        imageUrl = data.secure_url;
      } catch (err) {
        console.error(err);
        alert("Fehler beim Hochladen des Bildes");
        setLoading(false);
        return;
      }
    }
    const res = await fetch(`${baseUrl}/api/cheese-batches/${batchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        cheeseweight: cheeseweight ? Number(cheeseweight) : null,
        foto: imageFile ? imageUrl : previewUrl,
        milk_in_batch: validMilks.map(m => ({
          milk_id: m.milk_id,
          amount: m.amount
        })),
        created_at: batchDate,
        ready_at: readyDate,
        ispublic: isPublic,
        onTimeLine,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Fehler beim Speichern");
      return;
    }

    alert("Änderungen gespeichert");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Möchten Sie diese Käsecharge wirklich löschen?")) return;

    const res = await fetch(`${baseUrl}/api/cheese-batches/${batchId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Fehler beim Löschen");
      return;
    }

    router.push("/me/cheese-batches");
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-(--gray) rounded shadow">
      <p className="text-(--orange) font-bold">Bearbeitung</p>
      <h1 className="font-bold mb-4">
        Käsecharge nach dem {recipe?.name}-Rezept
      </h1>

      <div className="flex flex-col md:flex-row gap-5 md:gap-15 items-start mt-6">
        <div>
          <label className="font-medium  block">
            Herstellungsdatum <span className="text-(--orange)">*</span>
          </label>
          <input
            type="date"
            value={batchDate}
            onChange={(e) => setBatchDate(e.target.value)}
            className="w-full border border-(--olive) rounded p-2"
          />
        </div>
        <div>
          <label className="font-medium  block">
            Voraussichtliches Reifedatum
          </label>

          <input
            type="date"
            value={readyDate}
            readOnly
            className="w-full border border-(--olive) rounded  p-2  cursor-not-allowed"
          />

          {agingDays > 0 && (
            <p className="text-sm text-(--text_gray)">
              Reifezeit: {agingDays} Tage
            </p>
          )}
        </div>
      </div>

      <MilkSelector value={milks} onChange={setMilks} />

      <div className="mt-6">
        <label className="font-medium ">Beschreibung</label>
        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          className="mb-4 my-editor "
        />
      </div>

      <label className="font-medium ">
        {`Gewicht des hergestellten Käses (kg)`}{" "}
      </label>
      <input
        type="number"
        step="0.001"
        placeholder="Käsegewicht (kg)"
        className="w-30 border border-(--olive) rounded p-2 mx-3"
        value={cheeseweight}
        onChange={(e) => setCheeseweight(e.target.value)}
      />

      <img
        src={previewUrl}
        alt="Preview"
        className="w-48 h-48 object-cover bg-white rounded my-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        id="batchFoto"
        className="hidden"
      />
      <label
        htmlFor="batchFoto"
        className="px-3 py-2 bg-(--orange) font-bold text-white rounded cursor-pointer hover:bg-(--olive_bright) transition"
      >
        Bild hochladen
      </label>
      {/* CHECKBOX ON TIMELINE */}
      <div className="mt-4 flex items-center gap-2 my-check">
        <input
          type="checkbox"
          id="onTimeLine"
          checked={onTimeLine}
          onChange={(e) => setOnTimeLine(e.target.checked)}
          className="w-4 h-4 accent-(--orange)"
        />
        <label htmlFor="onTimeLine" className="text-(--text_gray)">
          Auf Timeline anzeigen
        </label>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-10">
        <button
          className="px-6 py-3 bg-gray-400 text-white rounded"
          onClick={() => handleSave(false)}
          disabled={loading}
        >
          Speichern
        </button>
        <button
          className="px-3 py-2  bg-(--olive_bright) font-bold text-white rounded cursor-pointer hover:bg-(--orange) transition"
          onClick={() => handleSave(true)}
          disabled={loading}
        >
          Veröffentlichen
        </button>
        <button
          className="px-3 py-2  bg-red-500 font-bold text-white rounded cursor-pointer hover:bg-(--orange) transition"
          onClick={handleDelete}
        >
          Löschen
        </button>
      </div>
    </section>
  );
}
