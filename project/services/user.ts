import { users } from "@prisma/client";

export async function fetchUser(nickname: string | undefined): Promise<users | null> {
  if (!nickname) return null; 
  try {
    const res = await fetch(`${baseUrl}/api/user/${encodeURIComponent(nickname)}`);
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}