import { getUserFromToken, type UserFromToken } from "../../../utils/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { type users } from "@prisma/client";

export default async function FavoritePage() {
  const user: UserFromToken | null = await getUserFromToken();

  if (!user) {
    redirect("/register");
  }
  const userFull: users | null = await prisma.users.findUnique({
    where: { nick_name: user.nick_name },
  });
  if (!userFull) {
    redirect("/register");
  }
  return <>
  Favorite rezepte
  </>;
}
