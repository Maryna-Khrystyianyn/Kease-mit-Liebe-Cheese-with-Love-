"use client";
import type { Batch, User } from "@/types/global";
import { Milk, Scale, CalendarDays, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface BatchProps {
  batch: Batch;
}

export function BatchItem({ batch }: BatchProps) {
  
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  const canEdit = user && user.nick_name === batch.user.nickName;
  return (
    <article className="bg-(--bg) rounded main-shadow p-10">
      {/* HEADER */}
      <div className="md:border-b border-(--olive) flex justify-between items-end gap-15 mb-3">
        <h1 className="font-bold ">
          <span>{`Käsecharge nach dem`} </span>{" "}
          <span className=""> {batch.recipeName}-Rezept</span>
        </h1>
        <p className="text-sm text-gray-400">
          {new Date(batch.date).toLocaleDateString()}
        </p>
      </div>

      {/* ICONS LIST */}
      <div className="  grid grid-cols-1 xl:grid-cols-4  lg:grid-cols-2 gap-x-10 gap-y-3 text-sm my-5">
        <div className="flex">
          <Milk size={25} />{" "}
          <div>
            {batch.milkArray.map((m, index) => {
              return (
                <div key={index} className="pl-5">
                  <span className="text-(--text_gray)">{m.type}</span>
                  <span className="pl-2">{m.amount} L</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-5">
          <Scale size={24} />
          <div>
            {" "}
            <p className="text-(--text_gray)">Gewicht des Käses</p>
            {`  ${batch.cheeseWeight} kg`}
          </div>
        </div>
        <div className="flex gap-5">
          <CalendarDays size={20} />{" "}
          <div>
            <p className="text-(--text_gray)">Herstellungdatum</p>
            <p>{new Date(batch.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-5">
          <CalendarCheck size={20} />
          <div>
            <p className="text-(--text_gray)">Reifedatum </p>
            {batch.readyAt && (
              <p>{new Date(batch.readyAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE */}
      {batch.image && (
        <img
          src={batch.image}
          alt={batch.recipeName}
          className="w-full max-h-96 xl:max-h-130 object-cover rounded mb-4"
        />
      )}

      {/* DESCRIPTION */}
      <div className="mt-5">
        {batch.description && (
          <div
            className="prose custom-list"
            dangerouslySetInnerHTML={{ __html: batch.description }}
          />
        )}
      </div>

      {/* EDIT BUTTON */}
      {canEdit && (
        <div className="mt-4">
          <a
            href={`/cheese-batches/edit/${batch.id}`}
            className="px-4 py-2 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange)"
          >
            Bearbeiten
          </a>
        </div>
      )}

      {/* AUTHOR */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--olive) pb-5 mt-5">
        <span className="text-sm ">{batch.user.username}</span>
        {batch.user.avatar && (
          <img
            src={batch.user.avatar}
            alt={batch.user.username}
            className="w-10 h-10 rounded-full object-cover border-2 border-(--orange)"
          />
        )}
      </div>
    </article>
  );
}
