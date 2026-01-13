"use client";

import Link from "next/link";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import { Cart } from "../icons/Cart";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { User } from "@/types/global";
import Login from "./Login";
import { useCart } from "@/app/context/CartContext";

const NavMobile = ({ user }: { user: User | null }) => {
  const { i18n, t } = useTranslation();
  const { cart } = useCart();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    i18n.changeLanguage("de");
  }, [i18n]);

  async function handleLogout() {
    await fetch(`${baseUrl}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  }

  // 🔥 кількість одиниць у корзині
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-[300px] bg-(--gray)">
      <ul className="mt-20 py-10 bg-(--gray_dunkel) flex flex-col gap-5 px-6 text-2xl">
        <li>
          <Link className="link-underline" href="/recipe">
            {t("rezepte")}
          </Link>
        </li>
        <li>
          <Link className="link-underline" href="/shop">
            {t("shop")}
          </Link>
        </li>
        <li>
          <Link className="link-underline" href="/cheese-batches">
            {t("tagebuch")}
          </Link>
        </li>
      </ul>

      <div className="my-5 p-5 flex flex-col gap-5">
        <ThemeSwitcher />

        {/* 🛒 CART WITH BADGE */}
        <Link
          href="/cart"
          className="link-underline text-base flex gap-3 items-center relative w-fit"
        >
          <div className="relative">
            <span className="text-xl">{Cart}</span>

            {totalItems > 0 && (
              <span
                className={`
      absolute -top-2 -right-3
      flex items-center justify-center
      text-[11px] font-bold text-white
      bg-(--orange)
      rounded-full
      ${totalItems < 10 ? "w-[18px] h-[18px]" : "min-w-[22px] h-[18px] px-1.5"}
    `}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>

          {t("warenkorb")}
        </Link>

        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-[14px] link-underline"
            >
              {t("logout")}
            </button>
          ) : (
            <div className="flex flex-col gap-3 mt-5">
              <Link href="/login" className="border-b-2 w-fit border-[#4F694C]">
                <Login />
              </Link>
              <Link
                href="/register"
                className="text-[16px] w-fit link-underline"
              >
                Registrieren
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavMobile;
