export type HomeAction = {
    label: string;
    icon: string;
    route?: string;       // внутрішній маршрут
    externalUrl?: string; // зовнішній сайт
  };

  export const actions: HomeAction[] = [
    {
      label: "Neue Käsecharge",
      icon: "plus-circle",
      route: "/cheese/new",
    },
    {
      label: "Meine Käsechargen",
      icon: "pot-steam",
      route: "/cheese",
    },
    {
      label: "Lieblings Rezepte",
      icon: "heart",
      route: "/recipes/favorites",
    },
    {
      label: "Alle Rezepte",
      icon: "book-open-page-variant",
      route: "/recipes",
    },
    {
      label: "Shop",
      icon: "cart",
      externalUrl: "https://kease-mit-liebe-cheese-with-love.vercel.app/shop", // <-- сюди твій URL
    },
  ];