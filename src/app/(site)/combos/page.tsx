"use client";
import { ProductCard, SectionHeader } from "@/components";
import { useGetComboCategories } from "@/queries/dataHandlers";

export default function CombosPage() {
  const { data: comboCategoriesData, isLoading } = useGetComboCategories();

  if (isLoading) return <></>;

  const categories = comboCategoriesData?.comboCategories || [];

  if (!categories.length) return <></>;

  return (
    <div className="max-xl:w-[95%] mx-auto">
      {categories.map((category: any) => (
        <div
          key={category.comboCategoryId}
          className="w-full mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px]"
        >
          <SectionHeader
            label={category.comboCategoryInfo?.name || "Combos"}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {category.products?.map((product: any) => (
              <ProductCard
                key={product.id}
                productData={product}
                pathname="combo"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
