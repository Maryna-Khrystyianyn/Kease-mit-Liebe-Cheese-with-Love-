import EditRecipeForm from "./EditRecipeForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipeId = Number(id);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Отримуємо дані з API
  const res = await fetch(`${baseUrl}/api/recipes/${recipeId}`, {
    cache: "no-store", // завжди свіжі дані
  });

  if (!res.ok) {
    return <p>Rezept nicht gefunden</p>;
  }

  // Розпарсуємо JSON
  const recipeData = await res.json();

  // Передаємо об’єкт з API в клієнтський компонент
  return <EditRecipeForm recipe={recipeData} />;
}
