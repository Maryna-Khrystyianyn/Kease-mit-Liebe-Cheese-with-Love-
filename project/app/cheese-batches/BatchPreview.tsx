import type { Batch } from "@/types/global";
import { Milk, Scale, CalendarDays, CalendarCheck } from "lucide-react";
import Link from "next/link";

interface BatchPreviewProps {
  batch: Batch;
}

export function BatchPreview({ batch }: BatchPreviewProps) {
  return (
    <div className="bg-(--gray) ">
      <div className="w-full flex lg:flex-row flex-col-reverse">
        {/* LEFT – IMAGE */}
        <div className="xl:h-[350px] xl:w-[400px] lg:h-[250px] lg:w-[400px] w-full h-[300px] lg:px-0 px-10 rounded-2xl shrink-0 xl:m-4 lg:mt-12 lg:mx-4">
          <img
            src={batch.image || "/cheese.png"}
            alt={batch.recipeName}
            className="xl:h-[350px] xl:w-[400px] lg:h-[250px] lg:w-[400px] w-full h-[300px] rounded-2xl  object-cover object-center "
          />
        </div>

        {/* RIGHT – CONTENT */}
        <div className=" md:p-10 px-10  flex flex-col justify-between w-full">
          {/* HEADER */}
          <Link
            href={`/cheese-batches/${batch.id}`}
            className=" md:border-b md:border-(--olive) flex justify-between items-end mb-3 mt-5 md:mt-0"
          >
            <h3 className="font-bold uppercase text-yellow-400 ">
              {batch.recipeName}
            </h3>
            <p className="text-sm text-gray-400">
              {new Date(batch.date).toLocaleDateString()}
            </p>
          </Link>
          {/* ICONS LIST */}
          <div className=" grid xl:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2  gap-x-1 gap-y-3 text-sm md:mb-0 mb-5">
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
                <span className="text-(--text_gray)">
                  Das Gewicht des Käses
                </span>
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
          </div>
          {/* for xl-screen */}
          <div className="hidden xl:block">
            {/* DESCRIPTION */}
            <div className="mt-5">
              {batch.description && (
                <div
                  className="description-preview"
                  dangerouslySetInnerHTML={{ __html: batch.description }}
                />
              )}

              <Link
                href={`/cheesebatches/${batch.id}`}
                className="mt-2 text-yellow-400 hover:underline text-sm"
              >
                {`> > > >`}
              </Link>
            </div>

            {/* AUTHOR */}
            <Link
              href={`/user/${batch.user.nickName}`}
              className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 pb-5"
            >
              <span className="text-sm ">{batch.user.username}</span>
              {batch.user.avatar && (
                <img
                  src={batch.user.avatar}
                  alt={batch.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* for lg screen */}
      <div className="xl:hidden lg:mx-5 mx-10">
        {/* DESCRIPTION */}
        <div className="mt-5">
          {batch.description && (
            <div
              className="description-preview"
              dangerouslySetInnerHTML={{ __html: batch.description }}
            />
          )}

          <Link
            href={`/cheesebatches/${batch.id}`}
            className="mt-2 text-yellow-400 hover:underline text-sm"
          >
            {`> > > >`}
          </Link>
        </div>

        {/* AUTHOR */}
        <Link
          href={`/user/${batch.user.nickName}`}
          className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 pb-5"
        >
          <span className="text-sm ">{batch.user.username}</span>
          {batch.user.avatar && (
            <img
              src={batch.user.avatar}
              alt={batch.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </Link>
      </div>
    </div>
  );
}
