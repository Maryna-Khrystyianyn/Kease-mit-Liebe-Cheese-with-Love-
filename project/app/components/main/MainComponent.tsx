"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";

export default function MainComponent() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("Searching:", query);
  }

  return (
    <section className="w-full bg-(--bg) text-(--text)">
      <div className="mx-auto flex  flex-col px-4 py-10 gap-8  md:flex-row md:items-center ">
        {/* IMAGE — mobile first */}
        <div className="order-1 md:order-2 md:w-1/2">
          <div className="relative  lg:h-90 xl:h-110 h-80 w-full overflow-hidden rounded-3xl shadow-lg ">
            <Image
              src="/kase-main.jpg"
              alt="Cheese"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* TEXT + SEARCH */}
        <div className="order-2 md:order-1 md:w-1/2">
          <div className="mb-6 font-bold text-3xl  md:text-5xl lg:text-6xl  xl:text-[80px] 2xl:text-[100px] md:pr-10">
            Gemeinschaft der Käser
          </div>
          <p className="text-(--text_gray)  lg:text-xl mb-6 md:pr-10">
            Gemeinsam für den perfekten Käse. Ein Ort, an dem Käser ihr Wissen
            Teilen. Hier finden Sie alles, was Sie zur Herstellung von köstlichem Käse benötigen.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Käsesorte"
              className="w-full rounded-lg border border-(--orange) bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="w-[200px]  rounded-lg bg-(--green-orange) px-4 py-2 font-medium text-(--bg) shadow-sm transition hover:bg-(--green-orange-hover)"
            >
              Rezept suhen
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
