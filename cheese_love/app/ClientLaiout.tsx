"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./components/header/Header";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
 
  const isHome = pathname === "/";
  return (
    <>
      <Header />
        <main>
          {children}  
        </main>
          
       
    </>
  );
}
