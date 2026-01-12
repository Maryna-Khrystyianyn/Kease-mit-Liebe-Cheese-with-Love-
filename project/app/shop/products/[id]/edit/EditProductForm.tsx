"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { products_categories as CategoryType } from "@prisma/client";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface EditProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  avaible: boolean | null;
  isPublic: boolean;
  image_url: string | null;
  image_id: string | null;
}

interface Props {
  product: EditProduct;
}

export default function EditProductForm({ product }: Props) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState<number | "">(product.price);
  const [categoryId, setCategoryId] = useState(product.category_id);
  const [isAvailable, setIsAvailable] = useState(product.avaible ?? true);
  const [isPublic, setIsPublic] = useState(product.isPublic);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(product.image_url);
  const [imageId, setImageId] = useState<string | null>(product.image_id);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  

  // categories
  useEffect(() => {
    fetch(`${baseUrl}/api/shop/products/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    let finalImageUrl = imageUrl;
    let finalImageId = imageId;

    // if I have new image - change Cloud
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      if (imageId) formData.append("oldImageId", imageId);

      const res = await fetch(`${baseUrl}/api/shop/upload-product-image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Bild Upload fehlgeschlagen");
        return;
      }

      const data = await res.json();
      finalImageUrl = data.url;
      finalImageId = data.id;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      category_id: categoryId,
      avaible: isAvailable,
      isPublic,
      image_url: finalImageUrl,
      image_id: finalImageId,
    };

    const res = await fetch(`${baseUrl}/api/shop/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    

    if (res.ok) {
      alert("Produkt aktualisiert");
      router.push("/shop");
    } else {
      console.error(await res.text());
      alert("Fehler beim Speichern");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-(--gray) rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Produkt bearbeiten</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border mb-4 rounded"
        placeholder="Produktname"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="w-full p-2 border mb-4 rounded"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <h4 className="font-semibold mb-2">Beschreibung</h4>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-6"
      />

      <input
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full p-2 border mb-4 rounded"
      />

      <div className="flex gap-8 mb-6">
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          Verfügbar
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Öffentlich
        </label>
      </div>

      <div className="mb-6">
        <img
          src={
            imageFile
              ? URL.createObjectURL(imageFile)
              : imageUrl || "/product.png"
          }
          alt="Produktbild"
          className="w-48 h-48 object-cover rounded mb-4"
        />

        <input
          id="productFoto"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 hidden"
        />
        <label
          htmlFor="productFoto"
          className="px-3 py-2 bg-(--orange) font-bold text-white rounded cursor-pointer hover:bg-(--olive_bright) transition"
        >
          Bild ändern
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-(--olive_bright) text-white rounded disabled:opacity-50"
      >
        Änderungen speichern
      </button>
    </div>
  );
}
