import RecipeItem from "./RecipeItem";

interface PageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipeId = Number(id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${recipeId}`,
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
    <div className="max-w-5xl mx-auto p-6">
      <RecipeItem recipe={recipeData} />
    </div>
  );
}
