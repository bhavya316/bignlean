"use client";
import { ProductCard, SectionHeader, SliderWrapper } from "@/components";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import useMediaQuery from "../../../useMediaQuery";

type Product = any;

type ComboCategory = {
  comboCategoryId: number;
  comboCategoryInfo: {
    id: number;
    name: string;
    image: string;
  };
  products: Product[];
  productCount: number;
};

type Props = {
  comboCategory: ComboCategory;
};

export default function ComboCategorySection({ comboCategory }: Props) {
  const { comboCategoryInfo, products } = comboCategory;
  const { slidePerView } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {products?.length > 0 && (
        <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px]">
          <SectionHeader
            onClick={() => router.push("/shop-by-brands")}
            label={comboCategoryInfo.name}
            showBtn
            btnLabel="View all"
          />
          <SliderWrapper
            showBtns={products?.length > 5 ? true : false}
            slidePerView={isMobile ? 1.5 : slidePerView}
          >
            {products.map((item, index) => (
              <SwiperSlide key={item.id || index} className="min-h-full py-1">
                <ProductCard productData={item} pathname="combo" />
              </SwiperSlide>
            ))}
          </SliderWrapper>
        </div>
      )}
    </>
  );
}
