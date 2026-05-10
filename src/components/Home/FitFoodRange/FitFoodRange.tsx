"use client";
import { ProductCard, SectionHeader, SliderWrapper } from "@/components";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import useMediaQuery from "../../../../useMediaQuery";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { ProductDataType } from "@/utils/Types";
import { useGetAllHomeProducts } from "@/queries/dataHandlers";

export default function FitFoodRange() {
  const { slidePerView } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: homeProducts } = useGetAllHomeProducts();

  // Get the "Fit Food Range" section from API data
  const fitFoodProducts = homeProducts?.data?.find((item: any) => item.name === "Fit Food Range")?.products || [];

  return (
    <>
      {fitFoodProducts?.length > 0 && (
        <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px]">
          <SectionHeader
            onClick={() => router.push("/shop-by-brands")}
            label="Fit Food Range"
            showBtn
            btnLabel="View all"
          />
          <SliderWrapper
            showBtns={fitFoodProducts?.length > 5 ? true : false}
            slidePerView={isMobile ? 1.5 : slidePerView}
          >
            {fitFoodProducts.map((item: ProductDataType, index: number) => (
              <SwiperSlide key={index} className="min-h-full py-1">
                <ProductCard productData={item} />
              </SwiperSlide>
            ))}
          </SliderWrapper>
        </div>
      )}
    </>
  );
} 
