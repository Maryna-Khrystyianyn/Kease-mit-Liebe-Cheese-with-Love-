"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Сервер рендерить нейтральне дерево без theme-dependent атрибутів
    return <>{children}</>;
  }

  // Клієнт вже може безпечно додавати data-theme
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}