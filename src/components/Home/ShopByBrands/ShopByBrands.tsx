"use client";
import { SectionHeader, SliderWrapper } from "@/components";
import { Brands } from "@/utils/Schemas";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import BrandCard from "./BrandCard";
import { useMediaQuery } from "react-responsive";

type Props = {
  brandsData: Brands[];
  isLoading?: boolean;
};

export default function ShopByBrands({ brandsData, isLoading = false }: Props) {
  const router = useRouter();
  const isMobile = useMediaQuery({ minWidth: 280, maxWidth: 450 });

  return (
    <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px] md:mt-[40px] md:gap-[30px] sm:mt-[30px] sm:gap-[20px] sm:px-4">
      <SectionHeader
        onClick={() => router.push("/shop-by-brands")}
        label="Shop by brands"
        showBtn={true}
        btnLabel="Show all"
      />
      {isLoading ? (
        <ShopByBrandsContentSkeleton />
      ) : (
        <>
          {isMobile ? (
            <div className="grid grid-cols-3 gap-4">
              {brandsData &&
                brandsData.map((brand) => (
                  <div key={brand.id} className="flex justify-center">
                    <BrandCard brandData={brand} />
                  </div>
                ))}
            </div>
          ) : (
            <div className="relative">
              <SliderWrapper
                slidePerView={6} // Ensure exactly 6 brands are visible
                showBtns={brandsData?.length > 6}
                slidesPerGroup={6}
                spaceBetween={16}
                watchSlidesProgress={true}
                loopFillGroupWithBlank={true}
                breakpoints={{
                  640: { slidesPerView: 3, slidesPerGroup: 3 },
                  0: { slidesPerView: 2, slidesPerGroup: 2 },
                }}
              >
                {brandsData &&
                  brandsData.map((brand) => (
                    <SwiperSlide
                      key={brand?.id}
                      className="min-h-full min-w-[calc((100%/6)-13.4px)] !mr-0 aspect-square
                        md:min-w-[150px]
                        sm:min-w-[120px]"
                    >
                      <BrandCard brandData={brand} />
                    </SwiperSlide>
                  ))}
              </SliderWrapper>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ShopByBrandsContentSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}
