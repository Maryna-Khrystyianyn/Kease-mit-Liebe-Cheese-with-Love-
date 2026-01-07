import { getUserFromToken, type UserFromToken } from "../../../utils/auth";
import { redirect } from "next/navigation";
import { Batch } from "@/types/global";
import MyBatchesForm from "./MyBatchesForm";

export default async function FavoritePage() {
  const user: UserFromToken | null = await getUserFromToken();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!user) {
    redirect("/register");
  }
  
  const response = await fetch(`${baseUrl}/api/cheese-batches/user/${user.nick_name}`);
  const batches: Batch[] = await response.json();
  return <MyBatchesForm batches={batches}/>;
}
