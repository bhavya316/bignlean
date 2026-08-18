"use client";
import { SectionHeader } from "@/components";
import { Categories } from "@/utils/Schemas";
import ShopCategoryCard from "./ShopCategoryCard";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function ShopByCategory({
  categoriesData,
  isLoading = false,
}: {
  categoriesData: Categories[];
  isLoading?: boolean;
}) {
  const router = useRouter();
  const isMobile = useMediaQuery({ minWidth: 280, maxWidth: 450 });
  const visibleCategories = useMemo(() => {
    const seen = new Set<string>();
    return (categoriesData || []).filter((category) => {
      const key = String(category?.name || category?.id).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [categoriesData]);

  return (
    <div className="w-[1200px] mx-auto mt-8 lg:mt-[60px] max-[1200px]:w-full flex flex-col gap-6 lg:gap-[40px]">
      <SectionHeader
        label="Shop by category"
        showBtn={true}
        btnLabel="Show all"
        onClick={() => router.push("/categories")}
      />
      {isLoading ? (
        <ShopByCategoryContentSkeleton />
      ) : (
        <>
          {isMobile ? (
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x hide-scrollbar pr-4">
              {visibleCategories?.map((category) => (
                <div key={category?.id} className="w-[150px] min-w-[150px] aspect-square snap-start">
                  <ShopCategoryCard
                    id={category?.id}
                    image={category.imageOn}
                    label={category.name}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              {/* Scrollable Category Grid with exactly 6 cards showing */}
              <div className="flex overflow-x-auto pb-4 snap-x hide-scrollbar">
                <div className="flex gap-4 w-max pr-4">
                  {visibleCategories && visibleCategories.map((category) => (
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
