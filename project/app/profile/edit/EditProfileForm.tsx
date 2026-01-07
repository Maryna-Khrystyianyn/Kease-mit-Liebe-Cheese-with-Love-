"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type users } from "@prisma/client";

interface Props {
  user: users;
}

export default function EditProfileForm({ user }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: user.username,
    telefon: user.telefon ?? "",
    mood: user.mood ?? "",
    info: user.info ?? "",
    user_address: user.user_address ?? "",
    ispublic: user.ispublic ?? true,
    issubscribed: user.issubscribed ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push(`/user/${user.nick_name}`);
    } else {
      alert("Fehler beim Speichern");
    }
  };

  return (
    <form
      className="max-w-xl mx-auto p-6 bg-(--gray) rounded shadow space-y-4 my-check"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold">Profil bearbeiten</h1>

      <div className="flex items-center space-x-6 flex-col sm:flex-row">
        <img
          src={user.avatar || "/user.png"}
          alt={`${user.nick_name} avatar`}
          className="rounded-full shadow-xl object-cover border-2 border-(--olive_bright) p-1 w-32 h-32"
        />

        <div className="min-w-40">
          <p className="font-semibold">{user.nick_name}</p>
          <p className="font-semibold">{user.email}</p>
        </div>
      </div>
      {/* =========================================================================== */}
      {/* Editable fields */}
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Benutzername"
        className="w-full border border-(--olive) px-3 py-2 rounded text-(--text_gray)"
        required
      />

      <input
        name="telefon"
        value={formData.telefon}
        onChange={handleChange}
        placeholder="Telefon"
        className="w-full border border-(--olive) px-3 py-2 rounded text-(--text_gray)"
      />
      <div>
        <p className="font-bold">Stimmung</p>
        <textarea
          name="mood"
          value={formData.mood}
          rows={3}
          onChange={handleChange}
          placeholder="Stimmung"
          className="w-full border border-(--olive) px-3 py-2 rounded text-(--text_gray)"
        />
      </div>
      <div>
        <p className="font-bold">Informationen über mich</p>
        <textarea
          name="info"
          value={formData.info}
          rows={5}
          onChange={handleChange}
          placeholder="Über mich"
          className="w-full border border-(--olive) px-3 py-2 rounded text-(--text_gray)"
        />
      </div>
<div>
    <p className="font-bold">Adress</p>
<input
        name="user_address"
        value={formData.user_address}
        onChange={handleChange}
        placeholder="Adresse"
        className="w-full border border-(--olive) px-3 py-2 rounded text-(--text_gray)"
      />

</div>
      

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="ispublic"
          checked={formData.ispublic}
          onChange={handleChange}
        />
        Öffentliches Profil
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="issubscribed"
          checked={formData.issubscribed}
          onChange={handleChange}
        />
        Newsletter abonnieren
      </label>

      <button className="px-4 py-2 bg-(--olive_bright) text-white rounded hover:bg-(--orange)">
        Speichern
      </button>
    </form>
  );
}
