"use client";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import "../../../lib/i18n";

const Nav = () => {
  const { t } = useTranslation();
  return (
    <ul className="flex gap-5 xl:text-2xl xl:gap-10">
      <li className="link-underline lg:test-3xl">
        <Link href={"/rezepte"}>{t("rezepte")}</Link>
      </li>
      <li className="link-underline">
        <Link href={"/shop"}>{t("shop")}</Link>
      </li>
      <li className="link-underline">
        <Link href={"/tagebuch"}>{t("tagebuch")}</Link>
      </li>
    </ul>
  );
};

export default Nav;
