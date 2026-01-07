import { getUserFromToken, type UserFromToken } from "../../../utils/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import FavoriteRecipesForm from "./FavoriteRecipesForm";


type FavoriteWithRecipe = Prisma.favorite_recipesGetPayload<{
    include: {
      recipes: {
        include: {
          recipes_categories: true;
        };
      };
    };
  }>;

export default async function FavoritePage() {
  const user: UserFromToken | null = await getUserFromToken();

  if (!user) {
    redirect("/register");
  }
  const favorites:FavoriteWithRecipe[] = await prisma.favorite_recipes.findMany({
    where: {
      user_nick: user.nick_name,
    },
    include: {
      recipes: {
        include: {
          recipes_categories: true,
        },
      },
    },
  });

  if (favorites.length === 0) return <h2>Du hast keine Lieblingsrezepte. 😢</h2>;

  return <FavoriteRecipesForm recipes = {favorites}/>;
}
