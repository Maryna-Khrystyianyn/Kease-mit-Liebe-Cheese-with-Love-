"use client";
import Link from "next/link";
import { useTranslation } from "@/node_modules/react-i18next";

const Nav = () => {
  const { t } = useTranslation();
  return (
    <ul className="flex gap-5 xl:text-2xl xl:gap-10">
      <li className="link-underline lg:test-3xl">
        <Link href={"#"}>{t("rezepte")}</Link>
      </li>
      <li className="link-underline">
        <Link href={"#"}>{t("shop")}</Link>
      </li>
      <li className="link-underline">
        <Link href={"#"}>{t("tagebuch")}</Link>
      </li>
    </ul>
  );
};

export default Nav;
