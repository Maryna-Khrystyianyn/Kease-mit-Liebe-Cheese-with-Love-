"use client";
import Link from "next/link";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import { Cart } from "../icons/Cart";

const NavMobile = () => {
  return (
    <div className=" w-[300px] bg-(--gray)">
      <div className="mt-20 italic text-base  px-5"></div>

      <ul className=" mt-5 py-10 bg-(--gray_dunkel) flex flex-col gap-5 px-6 text-2xl">
        <li>
          <Link className="link-underline " href={"#"}>Rezepte</Link>
        </li>
        <li>
          <Link className="link-underline " href={"#"}>Shop</Link>
        </li>
        <li>
          <Link className="link-underline " href={"#"}>Tagebuch</Link>
        </li>
      </ul>
      <div className="my-5 p-5 flex flex-col gap-5">
        <div className="text-base">Deutsch / Українська</div>
        <div>
          <ThemeSwitcher />
        </div>

        <div className="link-underline text-base flex gap-2 items-center  w-30">
          <span>{Cart}</span>Warenkorb
        </div>
        <button className=" link-underline text-left w-16">
          <span className="text-[14px]">Logaut </span>
        </button>
      </div>
    </div>
  );
};

export default NavMobile;
