import { prisma } from "@/lib/prisma";
import EditProductForm from "./EditProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  const productData = await prisma.products.findUnique({
    where: { id: productId },
    include: {
      products_categories: true,
    },
  });

  if (!productData) {
    return <p>Product nicht gefunden</p>;
  }

  const productForClient = {
    ...productData,
    price: Number(productData.price),
  };

  return <EditProductForm product={productForClient} />;
}
