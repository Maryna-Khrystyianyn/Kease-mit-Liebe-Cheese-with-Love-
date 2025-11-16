"use client";
import Link from "next/link";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import { Cart } from "../icons/Cart";
import { useTranslation } from "next-i18next";

const NavMobile = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const language = i18n.language;
  console.log(" language ------", language);
  return (
    <div className=" w-[300px] bg-(--gray)">
      <div className="mt-20 italic text-base  px-5"></div>

      <ul className=" mt-5 py-10 bg-(--gray_dunkel) flex flex-col gap-5 px-6 text-2xl">
        <li>
          <Link className="link-underline " href={"#"}>
          {t("rezepte")}
          </Link>
        </li>
        <li>
          <Link className="link-underline " href={"#"}>
          {t("shop")}
          </Link>
        </li>
        <li>
          <Link className="link-underline " href={"#"}>
          {t("tagebuch")}
          </Link>
        </li>
      </ul>
      <div className="my-5 p-5 flex flex-col gap-5">
        <div className="text-base">
          <span
            style={{ fontWeight: language === "de" ? "bold" : "" }}
            onClick={() => {
              i18n?.changeLanguage("de");
            }}
          >
            Deutsch
          </span>
          /
          <span style={{ fontWeight: language === "uk" ? "bold" : "" }} 
           onClick={() => {
            i18n?.changeLanguage("uk");
          }}>
            Українська
          </span>
        </div>
        <div>
          <ThemeSwitcher />
        </div>

        <div className="link-underline text-base flex gap-2 items-center  w-30">
          <span>{Cart}</span> {t("warenkorb")}
        </div>
        <button className=" link-underline text-left w-10">
          <span className="text-[14px]">{t("logout")} </span>
        </button>
      </div>
    </div>
  );
};

export default NavMobile;
