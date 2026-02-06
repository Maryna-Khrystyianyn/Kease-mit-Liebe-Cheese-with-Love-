// services/auth.ts
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/constants/config";

type AuthData = { email: string; password: string; username?: string };

export async function register(data: AuthData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Register failed");

  const result = await res.json();
  await SecureStore.setItemAsync("token", result.token);
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
