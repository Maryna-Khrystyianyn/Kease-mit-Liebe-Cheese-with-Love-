import { prisma } from "@/lib/prisma";
import { getUserFromToken, UserFromToken } from "../utils/auth";
import PageWrapper from "../PageWraper";
import ProductsList from "./ProductsList";
import { ProductForClient } from "@/types/global";


export default async function ShopPage() {
  const user: UserFromToken | null = await getUserFromToken();
  const isAdmin = user?.user_status === "admin";
  const productsRaw = await prisma.products.findMany({
    where: isAdmin ? {} : { isPublic: true },
    include: {
      products_categories: true,
    },
    orderBy: { id: "desc" },
  });

   // Decimal -> number
   const products:ProductForClient[] = productsRaw.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return (
    <PageWrapper>
      <h1 className="font-bold">Shop</h1>
      <ProductsList products={products} isAdmin={isAdmin} />;
    </PageWrapper>
  );
}
