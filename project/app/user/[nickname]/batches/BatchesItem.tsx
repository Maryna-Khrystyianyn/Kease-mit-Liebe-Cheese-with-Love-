"use client";
import { Batch } from "@/types/global";
import { motion } from "framer-motion";
import { CalendarCheck, CalendarDays, Milk, Scale } from "lucide-react";

function getAgingProgress(createdAt: string, agingDays: number) {
  const start = new Date(createdAt).getTime();
  const now = new Date().getTime();

  const daysPassed = (now - start) / (1000 * 60 * 60 * 24);

  const progress = (daysPassed / agingDays) * 100;

  return Math.min(Math.max(progress, 0), 100);
}

export default function BatchesItem({ batch }: { batch: Batch }) {
  const agingProgress = getAgingProgress(batch.createdAt, batch.agingDays);
  const isReady = agingProgress >= 100;

  const daysLeft = Math.max(
    0,
    Math.ceil(batch.agingDays - (agingProgress / 100) * batch.agingDays)
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-(--bg) rounded  p-4 flex flex-col gap-3 "
    >
      <div className="flex gap-10">
        {batch.image && (
          <img
            src={batch.image}
            alt={batch.recipeName}
            className="w-30 h-30 rounded-full object-cover"
          />
        )}
        <div>
          {!batch.isPublick && (
            <span className=" text-sm font-bold bg-(--text) text-(--bg) px-1 rounded w-25 text-center">
              ENTWURF
            </span>
          )}
          <h2 className="text-xl font-bold">{batch.recipeName}</h2>
          <span className="tect-[18px]">{batch.createdAt.slice(0, 10)}</span>
        </div>
      </div>

      {/* AGING PROGRESS */}
      <div className="mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-(--text_gray)">Reifung</span>
          <span className="font-semibold">{Math.round(agingProgress)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${agingProgress}%` }}
            transition={{ duration: 0.6 }}
            className={`h-full ${
              isReady ? "bg-green-500" : "bg-(--olive_bright)"
            }`}
          />
        </div>
        {isReady && (
          <p className="mt-1 text-sm font-semibold text-green-600">
            ✔ Käse ist gereift
          </p>
        )}{" "}
        {!isReady && (
          <p className="text-xs text-(--text_gray) mt-2">Noch ca. {daysLeft} Tage</p>
        )}
      </div>

      {/* ICONS LIST */}
      {/*  <div className=" grid grid-cols-2  gap-x-1 gap-y-3 text-sm md:mb-0 mb-5">
        <div className="flex">
          <Milk size={20} />{" "}
          <div>
            {batch.milkArray.map((m, index) => {
              return (
                <div key={index} className="pl-3">
                  <span className="text-(--text_gray)">{m.type}</span>
                  <span className="pl-2">{m.amount} L</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3">
          <Scale size={25} />
          <div>
            {" "}
            <span className="text-(--text_gray)">Das Gewicht des Käses</span>
            {`  ${batch.cheeseWeight} kg`}
          </div>
        </div>
        <div className="flex gap-3">
          <CalendarDays size={20} />{" "}
          <div>
            <p className="text-(--text_gray)">Herstellungdatum</p>
            <p>{new Date(batch.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <CalendarCheck size={20} />
          <div>
            <p className="text-(--text_gray)">Reifedatum </p>
            {batch.readyAt && (
              <p>{new Date(batch.readyAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div> */}
    </motion.article>
  );
}
