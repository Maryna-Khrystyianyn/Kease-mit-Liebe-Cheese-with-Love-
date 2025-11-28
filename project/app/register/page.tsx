"use client";

import { useState } from "react";
import styles from "./register.module.css";
import { useTranslation } from "next-i18next";
import "../../lib/i18n";
import { useRouter } from "next/navigation";

interface FormData {
  nick_name: string;
  username: string;
  email: string;
  password: string;
  telefon: string;
  avatar: string;
  user_status: "user" | "admin";
  ispublic: boolean;
  issubscribed: boolean;
  mood: string;
  info: string;
  user_address: string;
  lokale: string;
}

const Register = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nick_name: "",
    username: "",
    email: "",
    password: "",
    telefon: "",
    avatar: "",
    user_status: "user",
    ispublic: true,
    issubscribed: true,
    mood: "",
    info: "",
    user_address: "",
    lokale: i18n.language,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(t("registration_success"));
      alert(t("registration_success"));
      router.push("/");
      setFormData({
        nick_name: "",
        username: "",
        email: "",
        password: "",
        telefon: "",
        avatar: "",
        user_status: "user",
        ispublic: true,
        issubscribed: true,
        mood: "",
        info: "",
        user_address: "",
        lokale: i18n.language,
      });
    } else {
      setError(data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto lg:max-w-[1000px] max-w-[700px] p-6 bg-(--gray) rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">{t("registration")}</h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="lg:grid grid-cols-2 flex flex-col lg:gap-5 gap-3 items-end">
        <div className="w-full">
          <p className="text-(--orange)">*</p>
          <input
            type="text"
            name="nick_name"
            placeholder={t("placeholder.nick_name")}
            value={formData.nick_name}
            onChange={handleChange}
            className="w-full border border-(--olive) px-3 py-2 rounded"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-(--orange)">*</p>
          <input
            type="text"
            name="username"
            placeholder={t("placeholder.username")}
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-(--olive) px-3 py-2 rounded"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-(--orange)">*</p>
          <input
            type="email"
            name="email"
            placeholder={t("placeholder.email")}
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-(--olive) px-3 py-2 rounded"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-(--orange)">*</p>
          <input
            type="password"
            name="password"
            placeholder={t("placeholder.password")}
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-(--olive) px-3 py-2 rounded"
            required
          />
        </div>

        <input
          type="tel"
          name="telefon"
          placeholder={t("placeholder.telefon")}
          value={formData.telefon}
          onChange={handleChange}
          className="w-full border border-(--olive) px-3 py-2 lg:my-5 mt-5 rounded"
        />

        <input
          type="text"
          name="user_address"
          placeholder={t("placeholder.user_address")}
          value={formData.user_address}
          onChange={handleChange}
          className="w-full border border-(--olive) px-3 py-2 my-5 rounded"
        />
      </div>

      <input
        type="text"
        name="avatar"
        placeholder={t("placeholder.avatar")}
        value={formData.avatar}
        onChange={handleChange}
        className="w-full border border-(--olive) px-3 py-2 rounded"
      />

      <textarea
        name="mood"
        placeholder={t("placeholder.mood")}
        value={formData.mood}
        onChange={handleChange}
        className="w-full border border-(--olive) px-3 py-2 mt-5 rounded"
      />

      <textarea
        name="info"
        placeholder={t("placeholder.info")}
        value={formData.info}
        onChange={handleChange}
        className="w-full border border-(--olive) px-3 py-2 mt-4 rounded"
      />

      <div className="flex items-center space-x-7 ">
        <label className={styles.customCheckbox}>
          <input
            type="checkbox"
            name="ispublic"
            className={styles.hiddenInput}
            checked={formData.ispublic}
            onChange={handleChange}
          />
          <span className={styles.checkmark}></span>
          {t("public_profile")}
        </label>

        <label className={styles.customCheckbox}>
          <input
            type="checkbox"
            name="issubscribed"
            className={styles.hiddenInput}
            checked={formData.issubscribed}
            onChange={handleChange}
          />
          <span className={styles.checkmark}></span>
          {t("subscribe_newsletter")}
        </label>
      </div>

      <button
        type="submit"
        className="px-5 bg-(--olive_bright) text-white py-2 rounded hover:bg-(--orange) transition"
      >
        {t("register_button")}
      </button>
    </form>
  );
};

export default Register;
