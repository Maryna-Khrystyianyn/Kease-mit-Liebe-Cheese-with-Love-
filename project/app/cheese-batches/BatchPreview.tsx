import type { Batch } from "@/types/global";
import { Milk, Scale, CalendarDays, CalendarCheck } from "lucide-react";

interface BatchPreviewProps {
  batch: Batch;
}

export function BatchPreview({ batch }: BatchPreviewProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-(--gray) ">
      {/* LEFT – IMAGE */}
      <div className="flex  items-center px-10 py-10 md:py-0">
        <img
          src={batch.image || "/cheese.png"}
          alt={batch.recipeName}
          className="mx-auto rounded-2xl max-h-[400px] "
        />
      </div>

      {/* RIGHT – CONTENT */}
      <div className=" md:p-10 px-10  flex flex-col justify-between ">
        {/* HEADER */}
        <div className="border-b border-(--olive) flex justify-between items-end mb-3">
          <h3 className="text-3xl font-bold uppercase text-yellow-400 ">
            {batch.recipeName}
          </h3>
          <p className="text-sm text-gray-400">
            {new Date(batch.date).toLocaleDateString()}
          </p>
        </div>
        {/* ICONS LIST */}
        <div className="   grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-3 text-sm">
          <div className="flex">
            <Milk size={20} />{" "}
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
            <Scale size={25} />
            <div>
              {" "}
              <span className="text-(--text_gray)">
                Gewicht des fertigen Käses
              </span>
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

        {/* DESCRIPTION */}
        <div className="mt-5">
          {batch.description && (
            <div
              className="description-preview"
              dangerouslySetInnerHTML={{ __html: batch.description }}
            />
          )}

          <button className="mt-2 text-yellow-400 hover:underline text-sm">
            {`> > > >`}
          </button>
        </div>

        {/* AUTHOR */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 pb-5">
          <span className="text-sm ">
            {batch.user.username}
          </span>
          {batch.user.avatar && (
            <img
              src={batch.user.avatar}
              alt={batch.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
