"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination, A11y } from "swiper/modules";
import { Banners } from "@/utils/Schemas";
import ResponsiveBannerImage, { getBannerHref } from "./ResponsiveBannerImage";

export default function HomeCarosoul({
  className,
  bannersData,
}: {
  className?: string;
  bannersData: Banners[];
}) {
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
            const bannerLink = getBannerHref(banner?.link);
              
            return (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center overflow-hidden cursor-pointer img-change"
              >
                <Link href={bannerLink} className="w-full block">
                  <ResponsiveBannerImage
                    banner={banner}
                    alt="carousel banner"
                    className="w-full max-w-[1000px] aspect-[16/9] max-h-[320px] min-h-[140px] object-contain object-center block mx-auto rounded-lg bg-white shadow-lg"
                  />
                </Link>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}
