import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { EffectFade, Navigation, Pagination } from "swiper/modules";
import { Batch } from "@/types/global";
import { BatchPreviewCarousel } from "./BatchPreviewCarousel";

export default function BatchesCarousel() {
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    fetch(`/api/cheese-batches/publick`)
      .then((res) => res.json())
      .then((data: Batch[]) => {
        setBatches(data.slice(0, 10));
      });
  }, []);

  return (
    <div className="">
      <Swiper
        spaceBetween={30}
        /* effect={"fade"} */
        navigation={true}
       speed={1200}
        modules={[EffectFade, Navigation]}
        className="mySwiper"
      >
        {batches.map((batch) => {
          return (
            <SwiperSlide key={batch.id}>
              <BatchPreviewCarousel batch={batch} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
