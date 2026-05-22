"use client";

import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { ApiPaths } from "@/constants";
import { API_CONFIG } from "@/config/api";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetAllCategories, useGetCategoryHierarchy } from "@/queries/dataHandlers";
import { getMediaUrl } from "@/utils/media";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CategoriesPage() {
  const router = useRouter();
  const dispatch = useDispatchContext();
  const { data: hierarchyData, isLoading: hierarchyLoading } = useGetCategoryHierarchy();
  const { data: categoryData, isLoading: categoriesLoading } = useGetAllCategories();
  const [subcategories2BySubcategory, setSubcategories2BySubcategory] = useState<Record<number, any[]>>({});
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

  useEffect(() => {
    const subcategories = categories.flatMap((category: any) => category.subcategories || category.subCategories || []);
    if (!subcategories.length) return;

    let cancelled = false;
    const missingSubcategory2 = subcategories.filter((subcategory: any) => {
      const nested = subcategory.subcategories2 || subcategory.subCategories2 || [];
      return nested.length === 0 && subcategories2BySubcategory[subcategory.id] === undefined;
    });

    if (!missingSubcategory2.length) return;

    Promise.all(
      missingSubcategory2.map((subcategory: any) =>
        fetch(`${API_CONFIG.BASE_URL}${ApiPaths.SUBCATEGORIES2}/${subcategory.id}`)
          .then((response) => response.json())
          .then((result) => {
            const subcategories2 = Array.isArray(result?.subcategories2)
              ? result.subcategories2
              : Array.isArray(result?.subCategories2)
                ? result.subCategories2
                : Array.isArray(result?.data)
                  ? result.data
                  : [];
            return [subcategory.id, subcategories2] as [number, any[]];
          })
          .catch(() => [subcategory.id, []] as [number, any[]])
      )
    ).then((entries) => {
      if (cancelled) return;
      setSubcategories2BySubcategory((current) => ({
        ...current,
        ...Object.fromEntries(entries),
      }));
    });

    return () => {
      cancelled = true;
    };
  }, [categories, subcategories2BySubcategory]);

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

  const openSubcategory = (category: any, subcategory: any) => {
    clearBrandSelection();
    sessionStorage.setItem("selectedCategoryId", String(category.id));
    sessionStorage.setItem("selectedCategoryName", category.name || "");
    sessionStorage.setItem("selectedSubcategoryId", String(subcategory.id));
    sessionStorage.setItem("selectedSubcategoryName", subcategory.name || "");
    sessionStorage.removeItem("selectedSubcategory2Id");
    sessionStorage.removeItem("selectedSubcategory2Name");
    router.push(`/category/${category.id}/subcategory/${subcategory.id}`);
  };

  const openSubcategory2 = (category: any, subcategory: any, subcategory2: any) => {
    clearBrandSelection();
    sessionStorage.setItem("selectedCategoryId", String(category.id));
    sessionStorage.setItem("selectedCategoryName", category.name || "");
    sessionStorage.setItem("selectedSubcategoryId", String(subcategory.id));
    sessionStorage.setItem("selectedSubcategoryName", subcategory.name || "");
    sessionStorage.setItem("selectedSubcategory2Id", String(subcategory2.id));
    sessionStorage.setItem("selectedSubcategory2Name", subcategory2.name || "");
    router.push(`/category/${category.id}/subcategory/${subcategory.id}/subcategory2/${subcategory2.id}`);
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
              className="group flex min-h-[260px] flex-col rounded-xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => openCategory(category)}
                className="flex flex-1 flex-col items-center justify-center"
              >
                <p className="mb-3 line-clamp-2 min-h-[40px] text-sm font-bold text-black group-hover:text-[#E70F0F]">
                  {category.name}
                </p>
                <img
                  src={getMediaUrl(category.imageOn || category.image || category.imageOff, "/assets/product.png")}
                  alt={category.name || "Category"}
                  className="h-[110px] w-full object-contain mix-blend-multiply"
                />
              </button>
              <div className="mt-3 space-y-2 text-left">
                {(category.subcategories || category.subCategories || []).map((subcategory: any) => (
                  <div key={subcategory.id}>
                    <button
                      type="button"
                      onClick={() => openSubcategory(category, subcategory)}
                      className="text-xs font-bold text-[#1C1C2F] hover:text-[#E70F0F]"
                    >
                      {subcategory.name}
                    </button>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {((subcategory.subcategories2 || subcategory.subCategories2 || []).length > 0
                        ? subcategory.subcategories2 || subcategory.subCategories2 || []
                        : subcategories2BySubcategory[subcategory.id] || []
                      ).map((subcategory2: any) => (
                        <button
                          key={subcategory2.id}
                          type="button"
                          onClick={() => openSubcategory2(category, subcategory, subcategory2)}
                          className="rounded-full bg-gray-100 px-2 py-1 text-[11px] text-gray-600 hover:bg-red-50 hover:text-[#E70F0F]"
                        >
                          {subcategory2.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
