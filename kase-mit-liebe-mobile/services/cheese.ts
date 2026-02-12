import { API_URL } from "@/constants/config";
import { getToken } from "./auth";

export async function getUserBatches(nickname: string, page = 1, search = "") {
  const url = new URL(`${API_URL}/cheese-batches/user/${nickname}`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", "10");
  if (search) {
    url.searchParams.append("search", search);
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch batches");
  return await res.json();
}

export async function getBatchDetails(id: string) {
  const token = await getToken();
  const headers: any = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/cheese-batches/${id}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch batch details");
  return await res.json();
}

export async function getMilkTypes() {
  const res = await fetch(`${API_URL}/milk`);
  if (!res.ok) throw new Error("Failed to fetch milk types");
  return await res.json();
}

export async function uploadImage(uri: string) {
  const formData = new FormData();
  // @ts-ignore
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "upload.jpg",
  });
  formData.append("upload_preset", "cheese");

  const res = await fetch("https://api.cloudinary.com/v1_1/dnxh3rklj/image/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url;
}

export async function updateBatch(id: string, data: any) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/cheese-batches/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update batch");
  return await res.json();
}

export async function deleteBatch(id: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/cheese-batches/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete batch");
  return await res.json();
}

export async function getRecipes() {
  const res = await fetch(`${API_URL}/recipes?public=true`);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return await res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return await res.json();
}

export async function createBatch(data: any) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/cheese-batches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create batch");
  }
  return await res.json();
}

export async function getFavoriteRecipes() {
  const token = await getToken();
  const res = await fetch(`${API_URL}/favorite-recipes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch favorite recipes");
  return await res.json();
}

export async function getRecipeDetails(id: string) {
  const res = await fetch(`${API_URL}/recipes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch recipe details");
  return await res.json();
}

export async function toggleFavorite(recipeId: number) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/favorite-recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ recipeId })
  });
  if (!res.ok) throw new Error("Failed to toggle favorite");
  return await res.json();
}

export async function checkIsFavorite(recipeId: number) {
  const token = await getToken();
  if (!token) return { favorite: false };
  const res = await fetch(`${API_URL}/favorite-recipes/check?recipeId=${recipeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to check favorite status");
  return await res.json();
}

export async function getPublicBatchesByRecipe(recipeId: number) {
  const res = await fetch(`${API_URL}/cheese-batches/publick`);
  if (!res.ok) throw new Error("Failed to fetch public batches");
  const data = await res.json();
  // Filter on client side since publick endpoint doesn't support recipeId filter yet
  return data.filter((b: any) => b.recipeId === recipeId);
}
