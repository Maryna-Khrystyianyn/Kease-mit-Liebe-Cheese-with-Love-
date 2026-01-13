"use client";

import { useEffect, useState } from "react";
import { Cart } from "../icons/Cart";
import BurgerMenu from "./Burger-menu";
import Login from "./Login";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import Link from "next/link";
import { User } from "@/types/global";
import { useCart } from "@/app/context/CartContext";

const HeaderMobile = () => {
  const [user, setUser] = useState<User | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const { cart } = useCart();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
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
          <UserMenu
            username={user.username}
            avatar={user.avatar}
            nick={user.nick_name}
          />
        ) : (
          <>
            <Link href="/login" className=" border-b-2  border-[#4F694C]">
              <Login />
            </Link>
          </>
        )}

        <Link href="/cart" className="relative px-1">
          <div className="scale-75">{Cart}</div>

          {totalItems > 0 && (
            <span
              className="
                absolute -top-2 -right-2
                flex items-center justify-center
                min-w-[20px] h-[20px]
                px-1
                text-xs font-bold text-white
                bg-(--orange)
                rounded-full
              "
            >
              {totalItems}
            </span>
          )}
        </Link>
        <div className="border-l-2 border-[#4F694C] sm:pl-2 ml-5 sm:ml-2">
          <BurgerMenu user={user} />
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
