import RecipeItem from "./RecipeItem";
import RecipeSidebar from "../RecipeSidebar";
import MobileRecipeBar from "../MobileRecipeBar";
import PageWrapper from "@/app/PageWraper";


interface PageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: PageProps) {
  // const { id } = await params;
  const recipeId = Number(params.id);

  const res = await fetch(
    `/api/recipes/${recipeId}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!res.ok) {
    return <p>Rezept nicht gefunden</p>;
  }

  const recipeData = await res.json();

  return (
    <PageWrapper>
      <MobileRecipeBar recipeId={recipeId} />
      <div className="md:flex md:pl-5 ">
        <div className=" md:block hidden">
          <RecipeSidebar recipeId={recipeId} />
        </div>

        <div className=" mx-auto p-6">
          <RecipeItem recipe={recipeData} />
        </div>
      </div>
    </PageWrapper>
  );
}
