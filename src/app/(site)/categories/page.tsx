"use client";

import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { ApiPaths } from "@/constants";
import { API_CONFIG } from "@/config/api";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetAllCategories } from "@/queries/dataHandlers";
import { getMediaUrl } from "@/utils/media";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CategoriesPage() {
  const router = useRouter();
  const dispatch = useDispatchContext();
  const { data, isLoading } = useGetAllCategories();
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState<Record<number, any[]>>({});
  const [subcategories2BySubcategory, setSubcategories2BySubcategory] = useState<Record<number, any[]>>({});
  const categories = useMemo(() => {
    const seen = new Set<string>();
    return (data?.categories || []).filter((category: any) => {
      const key = String(category?.name || category?.id).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data?.categories]);

  useEffect(() => {
    if (!categories.length) return;

    let cancelled = false;

    async function loadHierarchy() {
      try {
        const subcategoryEntries = await Promise.all(
          categories.map(async (category: any) => {
            const response = await fetch(`${API_CONFIG.BASE_URL}${ApiPaths.SUBCATEGORIES}/${category.id}`);
            const result = await response.json();
            return [category.id, result?.subcategories || []] as [number, any[]];
          })
        );

        if (cancelled) return;

        const subcategoryMap = Object.fromEntries(subcategoryEntries) as Record<number, any[]>;
        setSubcategoriesByCategory(subcategoryMap);

        const allSubcategories = subcategoryEntries.flatMap(([, subcategories]) => subcategories);
        const subcategory2Entries = await Promise.all(
          allSubcategories.map(async (subcategory: any) => {
            const response = await fetch(`${API_CONFIG.BASE_URL}${ApiPaths.SUBCATEGORIES2}/${subcategory.id}`);
            const result = await response.json();
            return [subcategory.id, result?.subcategories2 || []] as [number, any[]];
          })
        );

        if (!cancelled) {
          setSubcategories2BySubcategory(Object.fromEntries(subcategory2Entries) as Record<number, any[]>);
        }
      } catch (error) {
        if (!cancelled) {
          setSubcategoriesByCategory({});
          setSubcategories2BySubcategory({});
        }
      }
    }

    loadHierarchy();

    return () => {
      cancelled = true;
    };
  }, [categories]);

  const clearBrandSelection = () => {
    dispatch({ type: "SET_SELECTED_BRANDS", payload: null });
  };

  const openCategory = (category: any) => {
    clearBrandSelection();
    sessionStorage.removeItem("selectedSubcategoryId");
    sessionStorage.removeItem("selectedSubcategoryName");
    sessionStorage.removeItem("selectedSubcategory2Id");
    sessionStorage.removeItem("selectedSubcategory2Name");
    router.push(`/shop-by-brands?category=${category.id}`);
  };

  const openSubcategory = (category: any, subcategory: any) => {
    clearBrandSelection();
    sessionStorage.setItem("selectedCategoryId", String(category.id));
    sessionStorage.setItem("selectedCategoryName", category.name || "");
    sessionStorage.setItem("selectedSubcategoryId", String(subcategory.id));
    sessionStorage.setItem("selectedSubcategoryName", subcategory.name || "");
    sessionStorage.removeItem("selectedSubcategory2Id");
    sessionStorage.removeItem("selectedSubcategory2Name");
    router.push(`/shop-by-brands?category=${category.id}&subcategory=${subcategory.id}`);
  };

  const openSubcategory2 = (category: any, subcategory: any, subcategory2: any) => {
    clearBrandSelection();
    sessionStorage.setItem("selectedCategoryId", String(category.id));
    sessionStorage.setItem("selectedCategoryName", category.name || "");
    sessionStorage.setItem("selectedSubcategoryId", String(subcategory.id));
    sessionStorage.setItem("selectedSubcategoryName", subcategory.name || "");
    sessionStorage.setItem("selectedSubcategory2Id", String(subcategory2.id));
    sessionStorage.setItem("selectedSubcategory2Name", subcategory2.name || "");
    router.push(`/shop-by-brands?category=${category.id}&subcategory=${subcategory.id}&subcategory2=${subcategory2.id}`);
  };

  return (
    <CustomPageWrapper heading="Shop by Category" className="flex flex-col gap-6">
      {isLoading ? (
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
                {(subcategoriesByCategory[category.id] || []).map((subcategory: any) => (
                  <div key={subcategory.id}>
                    <button
                      type="button"
                      onClick={() => openSubcategory(category, subcategory)}
                      className="text-xs font-bold text-[#1C1C2F] hover:text-[#E70F0F]"
                    >
                      {subcategory.name}
                    </button>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {(subcategories2BySubcategory[subcategory.id] || []).map((subcategory2: any) => (
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
