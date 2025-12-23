"use client";

import { useState } from "react";

interface Props {
  onUpload: (url: string) => void;
  initialImage?: string; // можна передати початкову картинку
}

export default function ImageUpload({ onUpload, initialImage }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage || "");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cheese_batches");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    onUpload(data.secure_url);
  }

  return (
    <div className="flex flex-col items-start">
      <img
        src={previewUrl || "/cheese.png"}
        alt="Preview"
        className="w-50 h-50 bg-white rounded object-cover mb-5"
      />
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <label
        htmlFor="imageUpload"
        className="px-3 py-2 bg-(--orange) font-bold text-white rounded cursor-pointer hover:bg-(--olive_bright) transition"
      >
        Bild hochladen
      </label>
    </div>
  );
}