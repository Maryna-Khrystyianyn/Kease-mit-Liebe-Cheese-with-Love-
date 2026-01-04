import EditRecipeForm from "./EditRecipeForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipeId = Number(id);
  console.log("RECIPE ID", recipeId);

  // Отримуємо дані з API
  const res = await fetch(
    `/api/recipes/${recipeId}`,
    {
      cache: "no-store", // завжди свіжі дані
    }
  );

  if (!res.ok) {
    return <p>Rezept nicht gefunden</p>;
  }

  // Розпарсуємо JSON
  const recipeData = await res.json();

  // Передаємо об’єкт з API в клієнтський компонент
  return <EditRecipeForm recipe={recipeData} />;
}
