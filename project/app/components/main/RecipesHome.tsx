import Link from "next/link";
import RecipeCarousel from "../carousel/RecipeCarosel";

const RecipesHome = () => {
  return (
    <div className="w-full 2xl:px-20 md:px-10">
      <div className="">
        <Link href={"/recipe"} className=" block mb-5">
         <h2 className=" font-bold tracking-widest">Neueste Rezepte</h2>
       
        </Link>
       
        <RecipeCarousel />
      </div>
    </div>
  );
};

export default RecipesHome;