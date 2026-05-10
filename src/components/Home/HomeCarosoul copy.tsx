"use client";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination, A11y } from "swiper/modules";
import NextButton from "../SliderButtons/NextButton";
import PrevButton from "../SliderButtons/PrevButton";
import { Banners } from "@/utils/Schemas";

export default function HomeCarosoul({
  className,
  bannersData,
}: {
  className?: string;
  bannersData: Banners[];
}) {
  const swiper = useSwiper();
  return (
    <div className={"w-full  " + " " + className}>
      <Swiper
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, A11y]}
        className="mySwiper w-full  max-[500px] relative"
      >
        {/* <PrevButton />
        <NextButton /> */}
        {bannersData &&
          bannersData?.length > 0 &&
          bannersData.map((banner, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center overflow-hidden cursor-pointer img-change"
            >
              <img
                src={banner?.web}
                alt="carosoul"
                className="block mx-auto xl:w-[70%] max-lg:object-cover overflow-hidden"
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
