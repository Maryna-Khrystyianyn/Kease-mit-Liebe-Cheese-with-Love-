"use client";

import { useState, useEffect } from "react";
import { products_categories as CategoryType } from "@prisma/client";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${baseUrl}/api/shop/products/categories`)
      .then((res) => res.json())
      .then((data: CategoryType[]) => setAllCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (publish: boolean) => {
    let imageUrl = "";
    let imageId = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const res = await fetch(`${baseUrl}/api/shop/upload-product-image`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.url;
        imageId = data.id;
      } catch (err) {
        console.error("GCS upload error:", err);
      }
    }

    const productData = {
      name,
      description,
      price: price ? Number(price) : 0,
      category_id: categoryId,
      avaible: isAvailable,
      isPublic: publish,
      image_url: imageUrl,
      image_id: imageId,
    };

    try {
      const res = await fetch(`${baseUrl}/api/shop/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert(publish ? "Produkt veröffentlicht!" : "Produkt gespeichert!");
        console.log("IMG PRODUCT",productData.image_url)
      
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId(0);
        setIsAvailable(true);
        setIsPublic(false);
        setImageFile(null);
      } else {
        console.error("Failed to create product", await res.text());
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-10 p-6 bg-(--gray) rounded shadow my-check">
      <h1 className="text-2xl font-bold mb-4">Neues Produkt hinzufügen</h1>

      <input
        type="text"
        placeholder="Produktname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-(--olive) mb-4 rounded"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="w-full p-2 border border-(--olive) mb-4 rounded h-11 bg-(--gray)"
      >
        <option value={0}>Kategorie wählen</option>
        {allCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>


      <h4 className="font-semibold mb-2">Beschreibung</h4>
       <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        className="mb-4 my-editor"
      />

      <input
        type="number"
        step="0.01"
        placeholder="Preis"
        value={price}
        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
        className="w-full p-2 border border-(--olive) mb-4 rounded"
      />

      <div className="flex gap-10 mb-10">
        <label className="flex gap-2 ">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          Verfügbar
        </label>
        <label  className="flex gap-2 ">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />{" "}
          Öffentlich (veröffentlichen)
        </label>
      </div>

      <div className="mb-10 ">
        <img
          src={imageFile ? URL.createObjectURL(imageFile) : "/product.png"}
          alt="Produktbild Vorschau"
          className="w-48 h-48 object-cover rounded mb-5"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="productImage"
        />
        <label
          htmlFor="productImage"
          className="px-3 py-2 bg-(--orange) text-white rounded cursor-pointer"
        >
          Bild hochladen
        </label>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleSubmit(false)}
          className="px-6 py-3 bg-gray-400 text-white rounded"
        >
          Speichern
        </button>
        <button
          onClick={() => handleSubmit(true)}
          className="px-6 py-3 bg-(--olive_bright) text-white rounded"
        >
          Veröffentlichen
        </button>
      </div>
    </div>
  );
}
