"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CheeseTimeline from "@/app/components/timeLine/CheeseTimeline";
import { Batch } from "@/types/global";

export default function UserCheese({ nickname }: { nickname: string }) {
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${baseUrl}/api/cheese-batches/user/${nickname}`);
      const data = await res.json();
      setBatches(data);
    }
    load();
  }, [nickname]);

  // Дані для таймлайну
  const timelineBatches = batches
    .filter((b) => b.onTimeLine)
    .map((b) => ({
      id: b.id,
      recipeName: b.recipeName,
      createdAt: b.createdAt,
      readyAt: b.readyAt ?? "",
    }));
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
  return (
    <div>

      {/* Таймлайн */}
      {timelineBatches.length > 0 && (
        <div>
          <h2 className="font-bold mb-3">Käsereifungsplan</h2>
          <CheeseTimeline
            batches={timelineBatches}
            onHide={async (id) => {
              await fetch(`${baseUrl}/api/cheese-batches/${id}/timeline`, {
                method: "PATCH",
                body: JSON.stringify({ onTimeLine: false }),
              });

              // Оновлюємо локальний стан
              setBatches((prev) =>
                prev.map((b) =>
                  b.id === id ? { ...b, onTimeLine: false } : b
                )
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
