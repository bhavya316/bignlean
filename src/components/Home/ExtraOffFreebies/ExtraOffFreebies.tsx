"use client";
import { ProductCard, SectionHeader, SliderWrapper } from "@/components";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import useMediaQuery from "../../../../useMediaQuery";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetAllOffers } from "@/queries/dataHandlers";
import { ProductDataType } from "@/utils/Types";

export default function ExtraOffFreebies() {
  const { slidePerView } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: offersData } = useGetAllOffers();

  // Get the second offer from the offers array
  const secondOffer = offersData?.offers?.[1];
  const extraOffProducts = secondOffer?.products || [];

  return (
    <>
      {extraOffProducts?.length > 0 && (
        <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px]">
          <SectionHeader
            onClick={() => router.push("/offers")}
            label={secondOffer?.name || "Extra 10% Off + Freebies"}
            showBtn
            btnLabel="View all"
          />
          <SliderWrapper
            showBtns={extraOffProducts?.length > 5 ? true : false}
            slidePerView={isMobile ? 1.5 : slidePerView}
          >
            {extraOffProducts.map((item: ProductDataType, index: number) => (
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
