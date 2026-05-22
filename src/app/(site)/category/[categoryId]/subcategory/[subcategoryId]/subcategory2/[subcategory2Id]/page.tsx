import CategoryProductListing from "@/components/CategoryProductListing/CategoryProductListing";

export default function Subcategory2Page({
  params,
}: {
  params: { categoryId: string; subcategoryId: string; subcategory2Id: string };
}) {
  return (
    <CategoryProductListing
      categoryId={params.categoryId}
      subcategoryId={params.subcategoryId}
      subcategory2Id={params.subcategory2Id}
    />
  );
}
