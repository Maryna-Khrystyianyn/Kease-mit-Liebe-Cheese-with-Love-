import { getUserFromToken, UserFromToken } from "@/app/utils/auth";
import { prisma } from "@/lib/prisma";
import ProductView from "./ProductView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) return <p>Invalid product</p>;

  const user: UserFromToken | null = await getUserFromToken();
  const isAdmin = user?.user_status === "admin";

  const product = await prisma.products.findFirst({
    where: {
      id: productId,
      ...(isAdmin ? {} : { isPublic: true }),
    },
    include: {
      products_categories: true,
    },
  });

  if (!product) {
    return <p>Produkt nicht gefunden</p>;
  }

  return (
    <ProductView
      product={{
        ...product,
        price: Number(product.price), // Decimal → number
      }}
    />
  );
}
