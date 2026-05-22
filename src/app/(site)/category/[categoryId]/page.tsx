import CategoryProductListing from "@/components/CategoryProductListing/CategoryProductListing";

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  return <CategoryProductListing categoryId={params.categoryId} />;
}
