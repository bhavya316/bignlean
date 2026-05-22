"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import Link from "next/link";
import ResponsiveBannerImage, { getBannerHref } from "./ResponsiveBannerImage";

interface Banner {
  id: number;
  phone: string;
  tab: string;
  web: string;
  link: string[];
  type: string;
}

interface Banner2SectionProps {
  banners: Banner[];
}

export default function Banner2Section({ banners }: Banner2SectionProps) {
  if (!banners || banners.length === 0) {
    return null;
  }

  // If multiple banners, show as carousel
  if (banners.length > 1) {
    return (
      <div className="my-8 max-[500px]:px-3">
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
          className="mySwiper w-full max-[500px] relative"
        >
          {banners.map((banner, index) => {
            const bannerLink = getBannerHref(banner?.link);
              
            return (
              <SwiperSlide
                key={banner.id}
                className="flex items-center justify-center overflow-hidden cursor-pointer img-change"
              >
                <Link href={bannerLink} className="w-full block">
                  <ResponsiveBannerImage
                    banner={banner}
                    alt={`Banner 2 Section ${index}`}
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

  // If single banner, show normally
  const singleBannerLink = getBannerHref(banners[0]?.link);

  return (
    <div className="my-8 flex justify-center cursor-pointer">
      <Link href={singleBannerLink} className="w-full max-w-[1000px] block">
        <ResponsiveBannerImage
          banner={banners[0]}
          alt="Banner 2 Section"
          className="w-full aspect-[16/9] max-h-[320px] min-h-[140px] object-contain object-center block mx-auto rounded-lg bg-white shadow-lg"
        />
      </Link>
    </div>
  );
}
