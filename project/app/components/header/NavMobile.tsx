"use client";
import Link from "next/link";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import { Cart } from "../icons/Cart";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { User } from "@/types/global";
import Login from "./Login";

const NavMobile = ({ user }: { user: User | null }) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  useEffect(() => {
    i18n.changeLanguage("de"); // immer de
  }, []);

  async function handleLogout() {
    console.log("TRAY LogAut");
    await fetch(`${baseUrl}/api/logout`, { method: "POST", credentials: "include" });
    window.location.href = "/";
  }

  return (
    <div className=" w-[300px] bg-(--gray)">
      <div className="mt-20 italic text-base  px-5"></div>

      <ul className=" mt-5 py-10 bg-(--gray_dunkel) flex flex-col gap-5 px-6 text-2xl">
        <li>
          <Link className="link-underline " href="/recipe">
            {t("rezepte")}
          </Link>
        </li>
        <li>
          <Link className="link-underline " href={"/shop"}>
            {t("shop")}
          </Link>
        </li>
        <li>
          <Link className="link-underline " href="/cheese-batches">
            {t("tagebuch")}
          </Link>
        </li>
      </ul>
      <div className="my-5 p-5 flex flex-col gap-5">
        {/* <div className="text-base">
          <span
            className="cursor-pointer"
            style={{ fontWeight: language === "de" ? "bold" : "" }}
            onClick={() => {
              i18n?.changeLanguage("de");
            }}
          >
            Deutsch
          </span>
          /
          <span
            className="cursor-pointer"
            style={{ fontWeight: language === "uk" ? "bold" : "" }}
            onClick={() => {
              i18n?.changeLanguage("uk");
            }}
          >
            Українська
          </span>
        </div> */}
        <div>
          <ThemeSwitcher />
        </div>

        <div className="link-underline text-base flex gap-2 items-center  w-30">
          <span>{Cart}</span> {t("warenkorb")}
        </div>
        <div className=" text-left w-10">
          {user ? (
            <button onClick={handleLogout} className="text-[14px] link-underline ">
              {t("logout")}{" "}
            </button>
          ) : (
            <div className="flex flex-col gap-3 mt-5">
              <Link href="/login" className=" border-b-2  w-13 border-[#4F694C]">
                <Login />
              </Link>
              <Link
                href="/register"
                className="sm:text-[22px] lg:text-[18px] w-32 link-underline "
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
