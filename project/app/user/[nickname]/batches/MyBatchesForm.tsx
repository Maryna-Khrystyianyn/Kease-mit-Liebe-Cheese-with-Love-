import { Batch } from "@/types/global";
import Link from "next/link";
import BatchesItem from "./BatchesItem";

export default function MyBatchesForm({ batches }: { batches: Batch[] }) {
  return (
    <div className="pt-10 sm:mx-10 mx-3">
        
      <h1 className="font-bold"> Meine Käsechargen</h1>

      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-5">
        {batches.map((b: Batch) => (
          <Link
            href={`/cheese-batches/${b.id}`}
            key={b.id}
            className="recipe-shadow "
          >
           <BatchesItem batch={b}/>
          </Link>
        ))}
      </div>
    </div>
  );
}
