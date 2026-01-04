"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      credentials:"include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Login erfolgreich!");
      window.location.href = "/";
      

    } else {
      setError(data.message || "Login fehlgeschlagen!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-40 lg:max-w-[500px] max-w-[400px] p-6 bg-(--gray) rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Anmeldung</h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="w-full">
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-(--olive) px-3 py-2 rounded"
          required
        />
      </div>

      <div className="w-full">
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-(--olive) px-3 py-2 rounded"
          required
        />
      </div>


      <button
        type="submit"
        className="px-5 bg-(--olive_bright) text-white py-2 rounded hover:bg-(--orange) transition"
      >
        Einloggen
      </button>
      <Link href="/register" className="text-[14px] opacity-40 ml-10 hover:opacity-90"> Du bist neu hier?</Link>
    </form>
  );
};

export default Login;