"use client";

import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetAllBrands } from "@/queries/dataHandlers";
import { getMediaUrl } from "@/utils/media";
import { useRouter } from "next/navigation";

export default function BrandsPage() {
  const router = useRouter();
  const dispatch = useDispatchContext();
  const { data, isLoading } = useGetAllBrands();
  const brands = data?.brands || [];

  const openBrand = (brand: any) => {
    dispatch({
      type: "SET_SELECTED_BRANDS",
      payload: `brands[]=${brand.id}`,
    });
    router.push(`/shop-by-brands?brands[]=${brand.id}`);
  };

  return (
    <CustomPageWrapper heading="Shop by Brands" className="flex flex-col gap-6">
      {isLoading ? (
        <div className="grid grid-cols-6 gap-4 max-[1100px]:grid-cols-4 max-[700px]:grid-cols-3 max-[480px]:grid-cols-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : brands.length > 0 ? (
        <div className="grid grid-cols-6 gap-4 max-[1100px]:grid-cols-4 max-[700px]:grid-cols-3 max-[480px]:grid-cols-2">
          {brands.map((brand: any) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => openBrand(brand)}
              className="group flex aspect-square flex-col items-center justify-center rounded-xl bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={getMediaUrl(brand.image || brand.logo, "/assets/logo.png")}
                alt={brand.name || "Brand"}
                className="h-[70%] w-full object-contain mix-blend-multiply"
              />
              <p className="mt-3 line-clamp-2 text-sm font-bold text-black group-hover:text-[#E70F0F]">
                {brand.name}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-10 text-center text-gray-500 shadow-sm">
          No brands available right now.
        </div>
      )}
    </CustomPageWrapper>
  );
}
