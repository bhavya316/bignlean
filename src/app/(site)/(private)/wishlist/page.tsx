"use client";
import { ProductCard } from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGEtWishList } from "@/queries/Product";

export default function Page() {
  const { userData } = useAppContext();
  const { data } = useGEtWishList(userData?.id as number);

  return (
    <CustomPageWrapper heading="Wishlist" showContentFooter={false}>
      {data?.data?.filteredList?.length === 0 && (
        <h3 className="text-center text-gray-400">Wishlist is Empty</h3>
      )}
      <div className="custom-grid2 mb-[70px]">
        {data?.filteredList?.length > 0 &&
          data?.filteredList?.map((wishItem: any, index: number) => (
            <ProductCard
              fullidth
              pathname="wishlist"
              productData={wishItem}
              key={index}
            />
          ))}
      </div>
    </CustomPageWrapper>
  );
}
