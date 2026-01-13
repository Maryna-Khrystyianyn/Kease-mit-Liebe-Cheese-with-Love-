"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Cart } from "../icons/Cart";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import Login from "./Login";
import Logo from "./Logo";
import Nav from "./Nav";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { User } from "@/types/global";
import { useCart } from "@/app/context/CartContext";

const HeaderDesktop = () => {
  const [user, setUser] = useState<User | null>(null);
  const { cart } = useCart();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    async function loadUser() {
      const res = await fetch(`${baseUrl}/api/me`, { cache: "no-store" });
      const data = await res.json();
      setUser(data.user as User);
    }
    loadUser();
  }, [baseUrl]);

  
  const totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="flex justify-between my-3 px-5 items-center">
      <Logo />
      <Nav />

      <div className="flex items-center gap-6">
        {user ? (
          <UserMenu
            username={user.username}
            avatar={user.avatar}
            nick={user.nick_name}
          />
        ) : (
          <>
            <Link href="/login" className="border-b-2 border-[#4F694C]">
              <Login />
            </Link>
            <Link
              href="/register"
              className="sm:text-[22px] lg:text-[18px] link-underline"
            >
              Registrieren
            </Link>
          </>
        )}

        {/* CART WITH BADGE */}
        <Link href="/cart" className="relative">
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

        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default HeaderDesktop;
