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
