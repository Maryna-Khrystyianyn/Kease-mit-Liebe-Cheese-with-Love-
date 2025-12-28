import Link from "next/link";
import BatchesCarousel from "../carousel/BatchesCarousel";

const BatchesHome = () => {
  return (
    <div className="w-full bg-(--gray) mb-20">
      <div className="2xl:m-20 md:m-10 lg:pt-10 pt-5">
        <Link href={"/cheese-batches"} className="pl-5 block mb-5 md:mb-0">
         <h2 className=" font-bold tracking-widest">Tagebuch</h2>
        <p className="font-semibold md:text-xl racking-widest">des Käsers</p>
        </Link>
       
        <BatchesCarousel />
      </div>
    </div>
  );
};

export default BatchesHome;
