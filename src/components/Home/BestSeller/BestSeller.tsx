"use client";
import { ProductCard, SectionHeader, SliderWrapper } from "@/components";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import useMediaQuery from "../../../../useMediaQuery";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetBestSellers } from "@/queries/dataHandlers";
import { ProductDataType } from "@/utils/Types";

export default function BestSeller() {
  const { slidePerView } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: bestSellersData, isLoading, error } = useGetBestSellers();

  // Get best seller products from API
  const bestSellerProducts = bestSellersData?.products || [];

  return (
    <>
      {bestSellerProducts?.length > 0 && (
        <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px]">
          <SectionHeader
            onClick={() => router.push("/shop-by-brands")}
            label="Best Seller"
            showBtn
            btnLabel="View all"
          />
          <SliderWrapper
            showBtns={bestSellerProducts?.length > 5 ? true : false}
            slidePerView={isMobile ? 1.5 : slidePerView}
          >
            {bestSellerProducts
              .filter((item: any) => item?.id && item?.name && item?.name !== "Unknown")
              .map((item: ProductDataType, index: number) => (
                <SwiperSlide key={index} className="min-h-full py-1">
                  <ProductCard productData={item} showBestsellerBadge />
                </SwiperSlide>
              ))}
          </SliderWrapper>
        </div>
      )}
    </>
  );
}
