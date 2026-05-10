"use client";
import React, { Suspense, useEffect } from "react";
import { ProductDetail, ProductFooter, ProductOverview } from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetProductDetail } from "@/queries/Cart";
import { ProductDetailType } from "@/utils/productType";
import { useSearchParams } from "next/navigation";

function ProductContent() {
  const searchParams = useSearchParams();
  const { userData } = useAppContext();

  if (!searchParams) return <></>;

  const productId = searchParams.get("id") as string;
  const { data } = useGetProductDetail(Number(productId), userData?.id ?? 0);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [productId]);

  if (!data) return <></>;
  const productData = {
    ...data?.data?.result,
    similerProduct: data?.data?.similerProduct
  } as ProductDetailType;
  return (
    <CustomPageWrapper heading="">
      <div className="flex gap-10 max-[890px]:flex-col max-[890px]:gap-5">
        <div className="flex-1">
          <ProductOverview
            information={productData?.information}
            images={productData?.images}
            id={Number(productId)}
          />
        </div>
        <div className="flex-1">
          <ProductDetail product={productData} />
        </div>
      </div>
      <div className="h-[2px] w-full bg-gray-200 my-10"></div>
      <ProductFooter product={productData} />
    </CustomPageWrapper>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductContent />
    </Suspense>
  );
}
