"use client";

import { useEffect, useState } from "react";
import { Cart } from "../icons/Cart";
import BurgerMenu from "./Burger-menu";
import Login from "./Login";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import Link from "next/link";
import { User } from "@/types/global";



const HeaderMobile = () => {
  const [user, setUser] = useState<User | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  useEffect(() => {
    async function loadUser() {
      const res = await fetch(`${baseUrl}/api/me`, { cache: "no-store" });
      const data = await res.json();
      setUser(data.user as User);
    }
    loadUser();
  }, []);

  return (
    <div className="flex justify-between items-center p-2 sm:mt-2 sm:px-4">
      <Logo />
      <div className="flex gap-2 sm:gap-6 ">
        {user ? (
          <UserMenu username={user.username} avatar={user.avatar} nick={user.nick_name}/>
        ) : (
          <>
            <Link href="/login" className=" border-b-2  border-[#4F694C]">
              <Login/>
            </Link>
          </>
        )}


        <span className="link-underline ">
          {" "}
          <div className="sm:pt-2 scale-75">{Cart}</div>
        </span>
        <div className="border-l-2 border-[#4F694C] sm:pl-2">
          <BurgerMenu user={user}/>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
