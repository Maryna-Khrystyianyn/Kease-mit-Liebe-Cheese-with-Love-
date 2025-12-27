import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface UserFromToken {
  nick_name: string;
  email: string;
  username: string;
  avatar?: string;
  user_status: string;
}

export async function getUserFromToken(): Promise<UserFromToken | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return null;

  try {
    const user = jwt.verify(token, JWT_SECRET) as UserFromToken;
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<UserFromToken> {
  const user = await getUserFromToken();
  if (!user) throw new Error("Nicht autorisiert");
  return user;
}

export async function requireUserStatus(status: string): Promise<UserFromToken> {
    const user = await getUserFromToken();
    if (!user) throw new Error("Unauthorized");
    if (user.user_status !== status) throw new Error("Forbidden");
    return user;
  }