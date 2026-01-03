"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Styles
import "swiper/css";
import "swiper/css/pagination";

type BatchImage = {
  id: number;
  foto: string;
};

interface Props {
  recipeId: number;
}

export default function RecipeBatchesCarousel({ recipeId }: Props) {
  const [items, setItems] = useState<BatchImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipeId) return;

    fetch(`/api/recipes/${recipeId}/public-batch-images`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [recipeId]);

  if (loading) {
    return <p className="text-sm text-gray-400">Bilder werden geladen…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        Keine öffentlichen Käsechargen mit Bildern
      </p>
    );
  }

  return (
    <div>
        <h3 className="my-5">Von unseren Käsern nach diesem Rezept hergestellt</h3>
      <Swiper
        slidesPerView={1.2}
        spaceBetween={16}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {items.map((batch) => (
          <SwiperSlide key={batch.id}>
            <Link href={`/cheese-batches/${batch.id}`} className="block group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={batch.foto}
                  alt={`Batch ${batch.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    Zur Charge →
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
