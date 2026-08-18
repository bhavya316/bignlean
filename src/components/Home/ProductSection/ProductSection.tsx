"use client";
import { ProductCard, SectionHeader, SliderWrapper } from "@/components";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import useMediaQuery from "../../../../useMediaQuery";

type Props = {
  products: any[];
  sectionName: string;
  expiryTime?: string | null;
  type: "Single" | "Combo";
};

export default function ProductSection({
  products,
  sectionName,
  expiryTime,
  type,
}: Props) {
  const { slidePerView } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <>
      {products?.length > 0 && (
        <div className="w-[1200px] mx-auto mt-8 lg:mt-[60px] max-[1200px]:w-full flex flex-col gap-6 lg:gap-[40px]">
          <SectionHeader
            expiryTime={expiryTime}
            onClick={() => router.push("/shop-by-brands")}
            label={sectionName}
            showBtn
            btnLabel="View all"
          />
          <SliderWrapper
            showBtns={products?.length > 5 ? true : false}
            slidePerView={isMobile ? 1.5 : slidePerView}
          >
            {products
              .filter((item: any) => item?.id && item?.name && item?.name !== "Unknown")
              .map((item, index) => (
                <SwiperSlide key={index} className="min-h-full py-1 ">
                  <ProductCard productData={item} />
                </SwiperSlide>
              ))}
          </SliderWrapper>
        </div>
      )}
    </>
  );
}
