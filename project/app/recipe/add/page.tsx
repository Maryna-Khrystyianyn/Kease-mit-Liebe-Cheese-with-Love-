"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ingredients as IngredientType,
  recipes_categories as CategoryType,
} from "@prisma/client";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type SelectedIngredient = {
  ingredientId: number;
  amount: number | "";
};

export default function AddRecipePage() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [aging, setAging] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [allIngredients, setAllIngredients] = useState<IngredientType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Завантаження інгредієнтів і категорій
  useEffect(() => {
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then((data: IngredientType[]) => setAllIngredients(data))
      .catch((err) => console.error("Error loading ingredients:", err));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: CategoryType[]) => setAllCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleAddIngredient = () => {
    setSelectedIngredients([
      ...selectedIngredients,
      { ingredientId: 0, amount: "" },
    ]);
  };

  const handleIngredientChange = (
    index: number,
    field: "ingredientId" | "amount",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    const newIngredients = [...selectedIngredients];
    newIngredients[index][field] = value;
    setSelectedIngredients(newIngredients);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (isPublic: boolean) => {
    let imageUrl = "";

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
        console.error("Cloudinary upload error:", err);
      }
    }

    const recipeData = {
      name: title,
      body: steps,
      aging: aging ? Number(aging) : null,
      category_id: categoryId,
      ispublic: isPublic,
      image: imageUrl,
      ingredients: selectedIngredients
        .filter((i) => i.ingredientId > 0 && i.amount !== "")
        .map((i) => ({
          ingredient_id: i.ingredientId,
          amount: Number(i.amount),
        })),
    };

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (res.ok) {
        alert(isPublic ? "Rezept veröffentlicht!" : "Rezept gespeichert!");
        // Очищення форми
        setTitle("");
        setSteps("");
        setAging("");
        setCategoryId(0);
        setSelectedIngredients([]);
        setImageFile(null);
      } else {
        console.error("Failed to create recipe", await res.text());
      }
    } catch (err) {
      console.error("Error creating recipe:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6   bg-(--gray) rounded shadow ">
      <h1 className="text-2xl font-bold mb-4">Neues Rezept hinzufügen</h1>

      <input
        type="text"
        placeholder="Rezepttitel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-(--olive) mb-4 rounded"
      />
      <div className="grid md:grid-cols-2 md:gap-10">
        <div>
         <h2 className="font-semibold mb-2">Kategorie</h2>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full p-2 border border-(--olive) mb-4 rounded h-11 bg-(--gray)"
        >
          <option value={0} >Kategorie wählen</option>
          {allCategories.map((c) => (
            <option key={c.id} value={c.id} className="bg-(--gray_dunkel)">
              {c.name}
            </option>
          ))}
        </select>   
        </div>
        <div>
          <h2 className="font-semibold mb-2">Trocknungszeit (in Tagen)</h2>
        <input
          type="number"
          placeholder="Tage"
          value={aging}
          onChange={(e) =>
            setAging(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full p-2 border border-(--olive) mb-4 rounded"
        />  
        </div>

        
      </div>

      <h2 className="font-semibold mb-2">Zutaten</h2>
      {selectedIngredients.map((ing, index) => (
        <div key={index} className="flex gap-2 mb-2  ">
          <select
            value={ing.ingredientId}
            onChange={(e) =>
              handleIngredientChange(
                index,
                "ingredientId",
                Number(e.target.value)
              )
            }
            className="border border-(--olive) p-2 rounded flex-1 bg-(--gray)"
          >
            <option value={0}>Zutat wählen</option>
            {allIngredients.map((i) => (
              <option key={i.id} value={i.id} className="bg-(--gray_dunkel)">
                {i.name} ({i.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Menge"
            value={ing.amount}
            onChange={(e) =>
              handleIngredientChange(index, "amount", e.target.value)
            }
            className="border border-(--olive) p-2 rounded w-32"
          />
        </div>
      ))}
      <button
        onClick={handleAddIngredient}
        className="px-3 py-2 mb-8 bg-(--orange) font-bold text-white rounded cursor-pointer hover:bg-(--olive_bright) transition"
      >
        Zutat hinzufügen
      </button>

      <h2 className="font-semibold mb-2">Schritte</h2>
      <ReactQuill
        theme="snow"
        value={steps}
        onChange={setSteps}
        className="mb-4 my-editor"
      />

      
      <img
          src={imageFile ? URL.createObjectURL(imageFile): "/cheese.png"}
          alt="Avatar preview"
          className="w-50 h-50 bg-white rounded object-cover mb-5"
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
    </div>
  );
}
