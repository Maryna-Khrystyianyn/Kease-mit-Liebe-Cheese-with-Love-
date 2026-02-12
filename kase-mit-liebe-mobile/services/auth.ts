// services/auth.ts
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/constants/config";

type AuthData = { email: string; password: string; username?: string };

export async function register(formData: FormData) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    body: formData, // multipart/form-data автоматично
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed");
  }

  const result = await res.json();

  // Якщо сервер повертає токен
  if (result.token) {
    await SecureStore.setItemAsync("token", result.token);
  }

  return result.user;
}

export async function login(data: AuthData) {

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");

  const result = await res.json();
  console.log("LOGIN RESULT:", result);
  await SecureStore.setItemAsync("token", result.token);
  return result.user;
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
}

export async function getToken() {
  return await SecureStore.getItemAsync("token");
}
export async function getMe() {
  const token = await getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  const result = await res.json();
  return result.user;
}

export async function getUserProfile(nickname: string) {
  const res = await fetch(`${API_URL}/user/${nickname}`);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return await res.json();
}

export async function getUserStats(nickname: string) {
  const res = await fetch(`${API_URL}/user/${nickname}/stats`);
  if (!res.ok) throw new Error("Failed to fetch user stats");
  return await res.json();
}

export async function updateProfile(data: any) {
  const token = await getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update profile");
  }

  return await res.json();
}
