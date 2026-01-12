import { prisma } from "@/lib/prisma";
import { getUserFromToken, UserFromToken } from "../utils/auth";
import PageWrapper from "../PageWraper";
import { ProductForClient } from "@/types/global";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const user: UserFromToken | null = await getUserFromToken();
  const isAdmin = user?.user_status === "admin";

  // Отримуємо всі продукти
  const productsRaw = await prisma.products.findMany({
    where: isAdmin ? {} : { isPublic: true },
    include: {
      products_categories: true,
    },
    orderBy: { id: "desc" },
  });

  // Decimal -> number
  const products: ProductForClient[] = productsRaw.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return (
    <PageWrapper>
      
      <ShopClient products={products} isAdmin={isAdmin} />
    </PageWrapper>
  );
}
