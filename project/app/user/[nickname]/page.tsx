//import UserProfile from "@/components/User/UserProfile"; // приклад клієнтського компоненту для відображення
import { type users } from "@prisma/client";

interface Params {
  params: { nickname: string };
}

export default async function PublicUserPage({ params }: Params) {
  // У новому App Router params може бути Promise, тому якщо потрібно:
  const { nickname } = await params;

  //const { nickname } = params;

  // Запит до нашого API роутера
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${nickname}`, {
    cache: "no-store", // завжди свіжі дані
  });

  const user: users | null = res.ok ? await res.json() : null;

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">User not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Передаємо користувача в клієнтський компонент */}
      {/* <UserProfile user={user} /> */}
      {user.nick_name}
    </div>
  );
}