"use client";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { type users } from "@prisma/client";

interface Props {
  user: users;
}

export default function UserProfile({ user }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as "uk" | "de";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{user.nick_name}</h1>

      <div className="flex items-center space-x-6">
        <Image
          src={user.avatar || "/user.png"}
          alt={`${user.nick_name} avatar`}
          width={120}
          height={120}
          className="rounded-full object-cover border w-32 h-32"
        />

        <div>
          <p className="text-xl font-semibold">@{user.username}</p>
          <p className="mt-2 text-gray-700">
            <span className="font-semibold">{t("status")}: </span>
            {user.user_status}
          </p>
        </div>
      </div>

      {user.mood && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">{t("mood")}</h2>
          <p>{user.mood[locale]}</p>
        </div>
      )}

      {user.info && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">{t("info")}</h2>
          <p className="whitespace-pre-wrap">{user.info[locale]}</p>
        </div>
      )}
    </div>
  );
}