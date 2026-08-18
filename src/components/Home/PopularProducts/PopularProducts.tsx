"use client";
import { ProductCard, SectionHeader, SliderWrapper } from "@/components";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import useMediaQuery from "../../../../useMediaQuery";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetAllHomeProducts } from "@/queries/dataHandlers";
import { ProductDataType } from "@/utils/Types";

export default function PopularProducts({ isLoading = false }: { isLoading?: boolean }) {
  const { slidePerView } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: homeProducts } = useGetAllHomeProducts();

  // Get the second product from API data
  const popularProducts = homeProducts?.data?.[1]?.products || [];

  return (
    <>
      {(popularProducts?.length > 0 || isLoading) && (
        <div className="w-[1200px] mx-auto mt-8 lg:mt-[60px] max-[1200px]:w-full flex flex-col gap-6 lg:gap-[40px]">
          <SectionHeader
            onClick={() => router.push("/shop-by-brands")}
            label="Popular Products"
            showBtn
            btnLabel="View all"
          />
          {isLoading ? (
            <PopularProductsContentSkeleton />
          ) : (
            <SliderWrapper
              showBtns={popularProducts?.length > 5 ? true : false}
              slidePerView={isMobile ? 1.5 : slidePerView}
            >
              {popularProducts
                .filter((item: any) => item?.id && item?.name && item?.name !== "Unknown")
                .map((item: ProductDataType, index: number) => (
                  <SwiperSlide key={index} className="min-h-full py-1">
                    <ProductCard productData={item} />
                  </SwiperSlide>
                ))}
            </SliderWrapper>
          )}
        </div>
      )}
    </>
  );
}

function PopularProductsContentSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-[15px] shadow-lg p-3 animate-pulse">
          <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
} 
