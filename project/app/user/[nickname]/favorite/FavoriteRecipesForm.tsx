import { Prisma } from "@prisma/client";
import FavouriteRecipeItem from "./FavouriteRecipeItem";
import Link from "next/link";

type FavoriteWithRecipe = Prisma.favorite_recipesGetPayload<{
  include: {
    recipes: {
      include: {
        recipes_categories: true;
      };
    };
  };
}>;

interface Props {
  recipes: FavoriteWithRecipe[];
}

export default function FavoriteRecipesForm({ recipes }: Props) {
  return (
    <div className="sm:mx-10 mx-3">
      <h1 className="font-bold"> Lieblingsrezepte</h1>

      <div className="flex flex-wrap justify-between gap-10">
        {recipes.map((fav) => (
            <Link href={`/recipe/${fav.recipe_id}`} key={fav.recipe_id}  className="recipe-shadow md:w-[47%] xl:w-[30%]"><FavouriteRecipeItem recipe={fav.recipes} /> </Link>
          
        ))}
      </div>
    </div>
  );
}
