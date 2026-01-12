import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/utils/auth";

import { ProductForClient } from "@/types/global";
import NewestProducts from "./NewestProducts";

export default async function ShopHome() {
  const user = await getUserFromToken();
  const isAdmin = user?.user_status === "admin";

  const productsRaw = await prisma.products.findMany({
    where: isAdmin ? {} : { isPublic: true },
    include: { products_categories: true },
    orderBy: { id: "desc" },
    take: 12,
  });

  const products: ProductForClient[] = productsRaw.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return <NewestProducts products={products} />;
}