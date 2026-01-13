export type User = {
  nick_name: string;
  email: string;
  username: string;
  avatar: string | null;
  user_status: "admin" | "basic" | "standard" | "premium" | "user";
};

type Milck = {
  type: string;
  amount: number;
};

export type Batch = {
  id: number;
  image: string | null;
  date: string;
  isPublick?: boolean;
  onTimeLine?: boolean;
  recipeName: string;
  recipeId: number;
  recipeCategory: string;
  agingDays: number;
  milkArray: Milck[];
  cheeseWeight: number | null;
  createdAt: string;
  readyAt: string | null;

  description: string | null;
  user: {
    nickName: string;
    username: string;
    avatar: string | null;
  };
};

export type ProductForClient = {
  id: number;
  name: string;
  category_id: number;
  description: string | null;
  price: number; // уже number
  avaible: boolean | null;
  image_url: string | null;
  image_id: string | null;
  isPublic: boolean;
  products_categories: {
    id: number;
    name: string;
    body: string | null;
  };
};

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};