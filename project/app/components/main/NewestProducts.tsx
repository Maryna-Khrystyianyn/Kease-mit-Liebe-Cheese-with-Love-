"use client";

import { useEffect, useState } from "react";
import { ProductForClient } from "@/types/global";
import ProductsCarousel from "../carousel/ProductsCarousel";
import MainProductCard from "./MainProductCard";
import Link from "next/link";

interface Props {
  products: ProductForClient[];
}

export default function NewestProducts({ products }: Props) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!width) return null;

  /** 📱 MOBILE → CAROUSEL */
  if (width < 640) {
    return <ProductsCarousel products={products} />;
  }

  /** 💻 GRID BREAKPOINTS */
  let visibleProducts = products;
  let gridClass = "";

  if (width >= 1536) {
    visibleProducts = products.slice(0, 10);
    gridClass = "grid-cols-5";
  } else if (width >= 1280) {
    visibleProducts = products.slice(0, 12);
    gridClass = "grid-cols-4";
  } else if (width >= 1024) {
    visibleProducts = products.slice(0, 9);
    gridClass = "grid-cols-3";
  } else if (width >= 768) {
    visibleProducts = products.slice(0, 9);
    gridClass = "grid-cols-3";
  } else {
    visibleProducts = products.slice(0, 8);
    gridClass = "grid-cols-2";
  }

  return (
    <section className="w-full 2xl:px-20 md:px-10 sm:px-5 my-5 ">
        <Link href={"/shop"}>
        <h2 className=" font-bold tracking-widest">Shop</h2>
        <p className="font-semibold md:text-xl racking-widest mb-5">Neueste Produkte</p>

        </Link>
        
      <div className={`grid gap-8 xl:gap-15 ${gridClass}`}>
        {visibleProducts.map((product) => (
          <MainProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
