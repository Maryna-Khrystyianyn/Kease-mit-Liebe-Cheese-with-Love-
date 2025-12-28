import type { Batch } from "@/types/global";
import { Milk, Scale, CalendarDays, CalendarCheck } from "lucide-react";
import Link from "next/link";

interface BatchPreviewProps {
  batch: Batch;
}

export function BatchPreviewCarousel({ batch }: BatchPreviewProps) {
  return (
    <div className="bg-(--gray) ">
      <div className="w-full flex lg:flex-row flex-col-reverse">
        {/* LEFT – IMAGE */}
        <div className="xl:pt-7 lg:h-[500px] lg:pt-7 md:h-[300px]">
            <div className="  2xl:w-[800px]  lg:h-[400px] xl:w-[700px] lg:w-[450px] w-full h-[300px] lg:px-0 px-10 rounded-2xl shrink-0 xl:m-4  lg:mx-4">
          <img
            src={batch.image || "/cheese.png"}
            alt={batch.recipeName}
            className=" 2xl:w-[800px] lg:h-[400px] xl:w-[700px] lg:w-[450px] w-full h-[300px] rounded-2xl  object-cover object-center "
          />
        </div>
        </div>
        

        {/* RIGHT – CONTENT */}
        <div className=" md:pt-2 md:pb-5 px-10  flex flex-col justify-between w-full">
          {/* HEADER */}
          <Link
            href={`/cheese-batches/${batch.id}`}
            className=" border-b border-(--olive) flex justify-between items-end mb-3"
          >
            <h3 className="font-bold uppercase text-yellow-400 ">
              {batch.recipeName}
            </h3>
            <p className="text-sm text-gray-400">
              {new Date(batch.date).toLocaleDateString()}
            </p>
          </Link>
          {/* ICONS LIST */}
          <div className=" grid grid-cols-2  gap-x-1 gap-y-3 text-sm md:mb-0 mb-5">
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
          {/* for lb-screen */}
          <div className="hidden lg:block">
            {/* DESCRIPTION */}
            <div className="mt-5">
              {batch.description && (
                <div
                  className="description-preview-carousel"
                  dangerouslySetInnerHTML={{ __html: batch.description }}
                />
              )}

              <Link
                href={`/cheesebatches/${batch.id}`}
                className="mt-2 text-yellow-400 hover:underline  font-bold"
              >
                {`> > > >`}
              </Link>
            </div>

            {/* AUTHOR */}
            <Link
              href={`/user/${batch.user.nickName}`}
              className="flex items-center justify-end gap-3 pt-4 pb-5"
            >
                
              <span className="font-bold ">{batch.user.username}</span>
              {batch.user.avatar && (
                <img
                  src={batch.user.avatar}
                  alt={batch.user.username}
                  className="w-14 h-14 rounded-full object-cover orange-shadow mx-4"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* for md screen */}
      <div className="lg:hidden lg:mx-5 mx-10">
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
            className="mt-2 text-yellow-400 hover:underline font-bold"
          >
            {`> > > >`}
          </Link>
        </div>

        {/* AUTHOR */}
        <Link
          href={`/user/${batch.user.nickName}`}
          className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 pb-5"
        >
          <span className="text-sm font-bold">{batch.user.username}</span>
          {batch.user.avatar && (
            <img
              src={batch.user.avatar}
              alt={batch.user.username}
              className="w-10 h-10 rounded-full object-cover orange-shadow mx-4"
            />
          )}
        </Link>
      </div>
    </div>
  );
}
