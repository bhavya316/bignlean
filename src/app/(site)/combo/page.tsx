"use client";
import { ProductCard, SectionHeader } from "@/components";
import { useGetComboCategories } from "@/queries/dataHandlers";

export default function ComboPage() {
  const { data: comboCategoriesData, isLoading } = useGetComboCategories();

  if (isLoading) return <></>;

  const categories = comboCategoriesData?.comboCategories || [];

  if (!categories.length) return <></>;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-3 pb-10 max-xl:w-[95%] sm:px-0">
      {categories.map((category: any) => (
        <div
          key={category.comboCategoryId}
          className="mx-auto mt-[60px] flex w-full flex-col gap-[40px] max-[640px]:mt-8 max-[640px]:gap-5"
        >
          <SectionHeader label={category.comboCategoryInfo?.name || "Combos"} />
          <div className="grid grid-cols-2 gap-4 max-[420px]:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
