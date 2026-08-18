"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import Link from "next/link";
import { getMediaUrl } from "@/utils/media";

interface Banner {
  id: number;
  phone: string;
  tab: string;
  web: string;
  link: string[] | string;
  type: string;
}

interface BannerSectionProps {
  banners: Banner[];
  title?: string;
  className?: string;
}

const getBannerLink = (banner?: Banner) => {
  if (Array.isArray(banner?.link) && banner.link.length > 0) {
    return banner.link[0];
  }
  if (typeof banner?.link === "string" && banner.link.length > 0) {
    return banner.link;
  }
  return "#";
};

export default function BannerSection({
  banners,
  title,
  className = ""
}: BannerSectionProps) {
  if (!banners || banners.length === 0) {
    return null;
  }

  // For hero slider, use carousel
  if (banners.length > 1) {
    return (
      <div className={`w-full ${className}`}>
        {title && (
          <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
        )}
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
          className="mySwiper w-full relative"
        >
          {banners.map((banner, index) => (
            <SwiperSlide
              key={banner.id}
              className="flex items-center justify-center overflow-hidden cursor-pointer img-change h-auto"
            >
              <Link href={getBannerLink(banner)} className="block h-full w-full">
                <img
                  src={getMediaUrl(banner?.web)}
                  alt={`banner-${index}`}
                  className="w-full h-auto object-cover object-center block mx-auto rounded-lg"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  // For single banner sections
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
      )}
      <div className="flex justify-center">
        <Link href={getBannerLink(banners[0])} className="block w-full max-w-[972px]">
          <img
            src={getMediaUrl(banners[0]?.web)}
            alt="banner"
            className="h-auto w-full rounded-[10px] object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
