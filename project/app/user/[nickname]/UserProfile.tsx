"use client";
import { useTranslation } from "next-i18next";
import { type users } from "@prisma/client";
import { CookingPot, Heart, SquarePen } from "lucide-react";
import Link from "next/link";

interface Props {
  user: users;
  curentUserNick?: string;
}

export default function UserProfile({ user, curentUserNick }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as "uk" | "de";
  console.log("User - mood ", user.mood);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold sm:my-5">{user.username}</h1>

      <div className="flex items-center space-x-6 flex-col sm:flex-row lg:flex-col xl:flex-row  py-10 sm:py-0 ">
        <img
          src={user.avatar || "/user.png"}
          alt={`${user.nick_name} avatar`}
          className="rounded-full shadow-xl object-cover border-2 border-(--olive_bright) p-1 w-32 h-32"
        />

        <div className="min-w-60 xl:min-w-40">
          {/*======= edit profil========= */}
          {curentUserNick === user.nick_name && (
            <Link
              href={"/profile/edit"}
              className="flex justify-end text-(--olive_bright)"
            >
              <SquarePen size={30} />{" "}
            </Link>
          )}

          <p className="font-semibold">{user.nick_name}</p>
          <p className="font-semibold">{user.email}</p>
          <p className="mt-2 text-gray-700">
            <span className="font-semibold">{t("status")}: </span>
            {user.user_status}
          </p>
        </div>
      </div>
      <div>

        {/* only for OUNER */}
        {curentUserNick === user.nick_name && (
          <div className="space-y-3 mt-10">
            <Link
              href={`/user/${user.nick_name}/favorite`}
              className="flex gap-3 link-underline w-[155px] items-end"
            >
              <Heart size={25} className="text-(--orange) pb-1"/>Lieblingsrezepte
            </Link>
            <Link
              href={`/user/${user.nick_name}/batches`}
              className="flex gap-3 link-underline w-[185px] items-end"
            >
               <CookingPot size={25} className="text-(--orange) pb-1" />Meine Käsechargen
            </Link>

            <Link href={"/cheese-batches/add"} className="link-underline w-[185px] items-end text-(--olive_bright)">Neue Käsecharge herstellen</Link>
          </div>
        )}
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
