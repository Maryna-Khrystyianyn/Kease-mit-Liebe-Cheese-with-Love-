"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types/global";
import { Batch } from "@/types/global";

interface BatchesListProps {
  nickName: string;
  activeId: number;
}

export default function MobileBatchesList({ nickName, activeId }: BatchesListProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  useEffect(() => {
    fetch(`${baseUrl}/api/me`)
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Error loading user:", err));

    fetch(`${baseUrl}/api/cheese-batches/user/${nickName}`)
      .then((res) => res.json())
      .then((data) => setBatches(data))
      .catch((err) => console.error("Error loading recipes:", err));
  }, []);

  const isOuner = user?.nick_name === nickName;

  const visibleBatches = batches.filter((b) => b.isPublick || isOuner);

  return (
    <div className="flex  gap-2 flex-wrap">
      {visibleBatches.slice(0, 10).map((batch) => {
        const isActive = activeId === batch.id;
        return (
          <div key={batch.id}>
            <Link
              href={batch.isPublick ? `/cheese-batches/${batch.id}` : `/cheese-batches/edit/${batch.id}`}
              className={`block px-2 py-1  link-underline text-(--text_gray)
                ${isActive ? "font-bold text-(--text)" : ""}`}
            >
              <div className="flex  gap-3">
                {batch.recipeName}
                <p className="text-sm text-gray-400">
                  {new Date(batch.date).toLocaleDateString()}
                </p>
              </div>

              {batch.image && (
                <img
                  src={batch.image}
                  alt={batch.recipeName}
                  className="mx-auto rounded-2xl h-[100px] "
                />
              )}
              {!batch.isPublick && isOuner && (
                <span className="ml-2 text-sm font-bold bg-(--text) text-(--bg) px-1 rounded">
                  ENTWURF
                </span>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
