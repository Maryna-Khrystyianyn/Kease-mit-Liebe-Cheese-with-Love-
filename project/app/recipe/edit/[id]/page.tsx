import EditRecipeForm from "./EditRecipeForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipeId = Number(id);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";


  const res = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
    cache: "no-store", 
  });

  if (!res.ok) {
    return <p>Rezept nicht gefunden</p>;
  }

  
  const recipeData = await res.json();

  
  return <EditRecipeForm recipe={recipeData} />;
}
