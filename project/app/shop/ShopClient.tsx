"use client";

import { useMemo, useState } from "react";
import { ProductForClient } from "@/types/global";
import ProductsList from "./ProductsList";
import ShopFiltersSidebar from "./ShopFiltersSidebar";
import MobileShopFilter from "./MobileShopFilter";


type SortOption = "newest" | "oldest" | "priceAsc" | "priceDesc";

interface Props {
  products: ProductForClient[];
  isAdmin: boolean;
}

export default function ShopClient({ products, isAdmin }: Props) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryId) {
      result = result.filter((p) => p.category_id === categoryId);
    }

    switch (sort) {
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        result.sort((a, b) => a.id - b.id);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
    }

    return result;
  }, [products, search, categoryId, sort]);

  return (
    <div>
       <MobileShopFilter
        products={products}
        search={search}
        setSearch={setSearch}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sort={sort}
        setSort={setSort}
      />  
 <div className="relative md:flex gap-4">
      <ShopFiltersSidebar
        products={products}
        search={search}
        setSearch={setSearch}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sort={sort}
        setSort={setSort}
      />

      <div className="flex-1">
        <ProductsList products={filteredProducts} isAdmin={isAdmin} />
      </div>
    </div>

    </div>
   
  );
}
