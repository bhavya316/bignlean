"use client";
import { SectionHeader } from "@/components";
import { Categories } from "@/utils/Schemas";
import ShopCategoryCard from "./ShopCategoryCard";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

export default function ShopByCategory({
  categoriesData,
  isLoading = false,
}: {
  categoriesData: Categories[];
  isLoading?: boolean;
}) {
  const router = useRouter();
  const isMobile = useMediaQuery({ minWidth: 280, maxWidth: 450 });

  return (
    <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full sm:px-4">
      <SectionHeader
        label="Shop by category"
        showBtn={true}
        btnLabel="Show all"
        onClick={() => router.push("/shop-by-brands")}
      />
      {isLoading ? (
        <ShopByCategoryContentSkeleton />
      ) : (
        <>
          {isMobile ? (
        <div className="category-grid">
          {categoriesData &&
            categoriesData.length > 0 &&
            Array.from(
              { length: Math.ceil(categoriesData.length / 2) },
              (_, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <div className={`category-card ${categoriesData[i * 2]?.name.toLowerCase().includes('vitamins') ? 'vitamins' : ''}`}>
                    <div className="category-label">{categoriesData[i * 2]?.name}</div>
                    <img
                      src={categoriesData[i * 2]?.imageOn}
                      alt={categoriesData[i * 2]?.name}
                      className="max-w-[80%] mx-auto"
                    />
                  </div>
                  {categoriesData[i * 2 + 1] && (
                    <div className={`category-card ${categoriesData[i * 2 + 1]?.name.toLowerCase().includes('vitamins') ? 'vitamins' : ''}`}>
                      <div className="category-label">{categoriesData[i * 2 + 1]?.name}</div>
                      <img
                        src={categoriesData[i * 2 + 1]?.imageOn}
                        alt={categoriesData[i * 2 + 1]?.name}
                        className="max-w-[80%] mx-auto"
                      />
                    </div>
                  )}
                </div>
              )
            )}
        </div>
      ) : (
        <div className="mt-6 relative overflow-hidden">
          {/* Scrollable Category Grid with exactly 6 cards showing */}
          <div className="flex overflow-x-auto pb-4 snap-x hide-scrollbar">
            <div className="flex gap-4">
              {categoriesData && categoriesData.map((category) => (
                <div 
                  key={category?.id} 
                  className="w-[calc((100%/6)-13.4px)] min-w-[calc((100%/6)-13.4px)] flex-shrink-0 aspect-square snap-start"
                >
                  <ShopCategoryCard
                    id={category?.id}
                    image={category.imageOn}
                    label={category.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

function ShopByCategoryContentSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}
