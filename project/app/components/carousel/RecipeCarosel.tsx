"use client"
import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import RecipeCarouselItem from "./RecipeCarouselItem";

export default function RecipeCarousel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${baseUrl}/api/recipes?public=true"`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.slice(0, 10));
      });
  }, []);
  return (
    <>
      <Swiper
        slidesPerView={1.2}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          700: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          900: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 40,
          },
          1550: {
            slidesPerView: 6,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {results.map((recipe) => {
          return (
            <SwiperSlide key={recipe.id} className="pb-15 pt-5 px-2">
              <RecipeCarouselItem
                id={recipe.id}
                name={recipe.name}
                imageUrl={recipe.image}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
