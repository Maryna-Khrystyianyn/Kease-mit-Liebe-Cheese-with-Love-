"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { ProductForClient } from "@/types/global";
import MainProductCard from "../main/MainProductCard";


interface Props {
  products: ProductForClient[];
}

export default function ProductsCarousel({ products }: Props) {
  return (
    <section className="mx-5 mb-15">
       <h2 className=" font-bold tracking-widest">Shop</h2>
        <p className="font-semibold md:text-xl racking-widest mb-5">Neueste Produkte</p>


      <Swiper
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1.2}
        pagination={{ clickable: true }}
        className="px-2"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <MainProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
