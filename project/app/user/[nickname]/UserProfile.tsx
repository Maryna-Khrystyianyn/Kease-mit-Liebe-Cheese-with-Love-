"use client";
import { useTranslation } from "next-i18next";
import { type users } from "@prisma/client";
import { SquarePen } from "lucide-react";

interface Props {
  user: users;
}

export default function UserProfile({ user }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as "uk" | "de";
  console.log("User - mood ", user.mood);
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold my-5">{user.username}</h1>

      <div className="flex items-center space-x-6 lg:flex-col xl:flex-row">
        <img
          src={user.avatar || "/user.png"}
          alt={`${user.nick_name} avatar`}
          className="rounded-full shadow-xl object-cover border-2 border-(--olive_bright) p-1 w-32 h-32"
        />

        <div className="min-w-40">
          <div className="flex justify-end text-(--olive_bright)">  <SquarePen size={30}/> </div>
          <p className="font-semibold">{user.nick_name}</p>
          <p className="font-semibold">{user.email}</p>
          <p className="mt-2 text-gray-700">
            <span className="font-semibold">{t("status")}: </span>
            {user.user_status}
          </p>
        </div>
      </div>

      {user.mood && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold ">{t("placeholder.mood")}</h3>
          <p>{user.mood}</p>
        </div>
      )}

      {user.info && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">{t("user.info")}</h3>
          <p className="whitespace-pre-wrap lg:text-sm">{user.info}</p>
        </div>
      )}
    </div>
  );
}
