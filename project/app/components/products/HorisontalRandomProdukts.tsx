"use client";

import { ProductForClient } from "@/types/global";
import { useCart } from "@/app/context/CartContext";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Props {
  products: ProductForClient[];
}

export default function HorisontalRandomProducts({ products }: Props) {
  const { addItem } = useCart();

  return (
    <div className="md:hidden ">
      <h3 className="font-bold mb-3 text-lg">Vielleicht gefällt Ihnen auch</h3>

      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={2}
        pagination={{ clickable: true }}
        className="px-1"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="flex flex-col gap-2 items-center pb-10">
              {/* IMAGE */}
              <div className="w-full aspect-[4/3] overflow-hidden rounded">
                <img
                  src={product.image_url || "/product.png"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* NAME & PRICE */}
              <div className="flex flex-col items-center gap-1 mt-2">
                <p className="text-sm font-semibold text-center">{product.name}</p>
                <p className="text-sm text-gray-600">{product.price} €</p>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                  });
                  toast.success("Der Artikel ist jetzt in deinem Warenkorb.");
                }}
                className="mt-2 px-4 py-1 bg-(--olive_bright) text-white rounded font-bold hover:bg-(--orange) text-sm"
              >
                In den Warenkorb
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
