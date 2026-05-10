"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import Link from "next/link";

interface Banner {
  id: number;
  phone: string;
  tab: string;
  web: string;
  link: string[];
  type: string;
}

interface Banner3SectionProps {
  banners: Banner[];
}

export default function Banner3Section({ banners }: Banner3SectionProps) {
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
            const bannerLink = (banner?.link && Array.isArray(banner.link) && banner.link.length > 0) 
              ? banner.link[0] 
              : ((typeof banner?.link === 'string') ? banner.link : "#");
              
            return (
              <SwiperSlide
                key={banner.id}
                className="flex items-center justify-center overflow-hidden cursor-pointer img-change h-[200px] sm:h-[250px] md:h-[300px]"
              >
                <Link href={bannerLink} className="w-full h-full block">
                  <img
                    src={banner?.web}
                    alt={`Banner 3 Section ${index}`}
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

  // If single banner, show normally
  const singleBannerLink = (banners[0]?.link && Array.isArray(banners[0].link) && banners[0].link.length > 0) 
    ? banners[0].link[0] 
    : ((typeof banners[0]?.link === 'string') ? banners[0].link : "#");

  return (
    <div className="my-8 flex justify-center cursor-pointer">
      <Link href={singleBannerLink} className="w-full max-w-[1000px] block">
        <img
          src={banners[0]?.web}
          alt="Banner 3 Section"
          className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover object-center block mx-auto rounded-lg shadow-lg"
        />
      </Link>
    </div>
  );
}
