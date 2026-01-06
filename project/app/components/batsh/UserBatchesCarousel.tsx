"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Styles
import "swiper/css";
import "swiper/css/pagination";
import { User } from "@/types/global";

type BatchImage = {
  id: number;
  foto: string;
  ispublic: boolean;
};

interface Props {
  nickname: string;
}
/* //Logined user
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []); */

export default function UserBatchesCarousel({ nickname }: Props) {
  const [items, setItems] = useState<BatchImage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!nickname) return;

    fetch(`${baseUrl}/api/user/${nickname}/batch-images`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [nickname]);

  //Logined user
  useEffect(() => {
    fetch(`${baseUrl}/api/me`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  const filteredItems = items.filter((batch:BatchImage) => {
    
    if (user && user.nick_name === nickname) return true;
  
    return batch.ispublic === true;
  });

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
    <div className="mt-10 ">
      <h2 className="font-bold my-5">Meine Käsechargen </h2>
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
        className="mySwiper "
      >
        {filteredItems.map((batch) => (
          <SwiperSlide key={batch.id}>
            <Link href={`/cheese-batches/${batch.id}`} className="block group pb-10">
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
