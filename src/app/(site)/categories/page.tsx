"use client";

import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetAllCategories, useGetCategoryHierarchy } from "@/queries/dataHandlers";
import { getMediaUrl } from "@/utils/media";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function CategoriesPage() {
  const router = useRouter();
  const dispatch = useDispatchContext();
  const { data: hierarchyData, isLoading: hierarchyLoading } = useGetCategoryHierarchy();
  const { data: categoryData, isLoading: categoriesLoading } = useGetAllCategories();
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const hierarchyCategories = Array.isArray(hierarchyData?.categories)
      ? hierarchyData.categories
      : Array.isArray(hierarchyData?.data)
        ? hierarchyData.data
        : [];
    const plainCategories = Array.isArray(categoryData?.categories)
      ? categoryData.categories
      : Array.isArray(categoryData?.data)
        ? categoryData.data
        : [];
    const sourceCategories = hierarchyCategories.length > 0 ? hierarchyCategories : plainCategories;
    return sourceCategories.filter((category: any) => {
      const key = String(category?.id || category?.name);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [categoryData, hierarchyData]);

  const clearBrandSelection = () => {
    dispatch({ type: "SET_SELECTED_BRANDS", payload: null });
  };

  const openCategory = (category: any) => {
    clearBrandSelection();
    sessionStorage.setItem("selectedCategoryId", String(category.id));
    sessionStorage.setItem("selectedCategoryName", category.name || "");
    sessionStorage.removeItem("selectedSubcategoryId");
    sessionStorage.removeItem("selectedSubcategoryName");
    sessionStorage.removeItem("selectedSubcategory2Id");
    sessionStorage.removeItem("selectedSubcategory2Name");
    router.push(`/category/${category.id}`);
  };

  return (
    <CustomPageWrapper heading="Shop by Category" className="flex flex-col gap-6">
      {hierarchyLoading || categoriesLoading ? (
        <div className="grid grid-cols-5 gap-4 max-[1000px]:grid-cols-4 max-[700px]:grid-cols-3 max-[480px]:grid-cols-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-5 gap-4 max-[1000px]:grid-cols-4 max-[700px]:grid-cols-3 max-[480px]:grid-cols-2">
          {categories.map((category: any) => (
            <article
              key={category.id}
              className="group flex min-h-[210px] flex-col rounded-xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => openCategory(category)}
                className="flex flex-1 flex-col items-center justify-center"
              >
                <img
                  src={getMediaUrl(category.imageOff, "/assets/logo.png")}
                  alt={category.name || "Category"}
                  className="h-[110px] w-full object-contain mix-blend-multiply"
                />
                <p className="mt-3 line-clamp-2 min-h-[40px] text-sm font-bold text-black group-hover:text-[#E70F0F]">
                  {category.name}
                </p>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-10 text-center text-gray-500 shadow-sm">
          No categories available right now.
        </div>
      )}
    </CustomPageWrapper>
  );
}
