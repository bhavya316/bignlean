"use client";
import { ProductCard, SectionHeader, SliderWrapper } from "@/components";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetRecentViews } from "@/queries/dataHandlers";
import { useRouter } from "next/navigation";
import { SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";

export default function RecentlyViewed() {
  const { slidePerView, userData } = useAppContext();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Get recent views from API
  const { data: recentViewsData, isLoading } = useGetRecentViews(userData?.id as number);

  // Transform API data to match product format and remove duplicates
  const recentlyViewedProducts = recentViewsData?.recentViews
    ?.filter((view: any) =>
      view?.product &&
      view?.product?.id &&
      view?.product?.name &&
      view?.product?.name !== "Unknown"
    )
    ?.map((view: any) => {
      const product = view.product;

      // Calculate discount percentage
      const premiumPrice = parseFloat(product.varients?.[0]?.premiumPrice || "0");
      const sellingPrice = parseFloat(product.varients?.[0]?.sellingPrice || "0");
      const discountPercentage = premiumPrice > 0 ? ((premiumPrice - sellingPrice) / premiumPrice) * 100 : 0;

      return {
        id: product.id,
        catId: product.catId,
        subCatId: product.subCatId,
        name: product.name,
        isBestSeller: product.isBestSeller === 1 || product.isBestSeller === true,
        isOnFlashSale: product.isOnFlashSale === 1 || product.isOnFlashSale === true,
        images: product.images || [],
        overView: product.overView || [],
        details: product.details || [],
        tables: product.tables || [],
        information: product.information || [],
        certificates: product.certificates || [],
        supplements: product.supplements || [],
        brand: product.brand || { body: "", heading: "" },
        hit: product.hit || 0,
        varients: product.varients || [],
        createdAt: product.createdAt || "",
        updatedAt: product.updatedAt || "",
        averageRating: product.averageRating || 0,
        discountPercentage: discountPercentage,
        totalRating: product.totalRating || 0,
        ratings: product.ratings || [],
        myRating: product.myRating || []
      };
    })
    // Remove duplicates by keeping only the first occurrence of each product ID
    ?.filter((product: any, index: number, self: any[]) =>
      index === self.findIndex((p: any) => p.id === product.id)
    ) || [];

  return (
    <>
      {recentlyViewedProducts?.length > 0 && (
        <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px]">
          <SectionHeader
            onClick={() => router.push("/shop-by-brands")}
            label="Recently Viewed"
            showBtn
            btnLabel="View all"
          />
          <SliderWrapper
            showBtns={recentlyViewedProducts?.length > 5 ? true : false}
            slidePerView={isMobile ? 1.5 : slidePerView}
          >
            {recentlyViewedProducts.map((item: any, index: number) => (
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
