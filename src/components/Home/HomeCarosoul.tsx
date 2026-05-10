"use client";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import Link from "next/link";

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
    <div
      className={
        "w-full max-xl:w-[95%] mx-auto px-3 sm:px-5 " + " " + className
      }
    >
      <Swiper
        slidesPerView={1}
        centeredSlides={false}
        spaceBetween={0}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, A11y]}
        className="mySwiper w-full max-[500px] relative overflow-hidden"
      >
        {/* <PrevButton />
        <NextButton /> */}
        {bannersData &&
          bannersData?.length > 0 &&
          bannersData.map((banner, index) => {
            const bannerLink = (banner?.link && Array.isArray(banner.link) && banner.link.length > 0) 
              ? banner.link[0] 
              : ((typeof banner?.link === 'string') ? banner.link : "#");
              
            return (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center overflow-hidden cursor-pointer img-change h-[200px] sm:h-[250px] md:h-[300px]"
              >
                <Link href={bannerLink} className="w-full h-full block">
                  <img
                    src={banner?.web}
                    alt="carosoul"
                    className="w-full max-w-[1000px] h-[200px] sm:h-[250px] md:h-[300px] object-cover object-center block mx-auto rounded-lg shadow-lg"
                  />
                </Link>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}
