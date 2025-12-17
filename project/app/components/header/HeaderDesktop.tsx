"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Cart } from "../icons/Cart";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import Login from "./Login";
import Logo from "./Logo";
import Nav from "./Nav";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { User } from "@/types/global";



const HeaderDesktop = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user as User);
      console.log("USER AVATAR", user?.avatar)
    }
    loadUser();
  }, []);

  return (
    <div className="flex justify-between my-3 px-5 items-center">
      <Logo />
      <Nav />

      <div className="flex items-center gap-6">
        {user ? (
          <UserMenu username={user.username} avatar={user.avatar} />
        ) : (
          <>
            <Link href="/login" className=" border-b-2  border-[#4F694C]">
              <Login />
            </Link>
            <Link
              href="/register"
              className="sm:text-[22px] lg:text-[18px] link-underline "
            >
              Registrieren
            </Link>
          </>
        )}

        <span className="link-underline ">
          {" "}
          <div className="scale-75">{Cart}</div>
        </span>

        {/*  <LanguageSwitcher/> */}
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default HeaderDesktop;
