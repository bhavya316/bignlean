"use client";
import { ProductDetail, ProductFooter, ProductOverview } from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useGetComboProductDetail } from "@/queries/dataHandlers";
import { ProductDetailType } from "@/utils/productType";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Page() {
  const params = useParams();

  if (!params) return <></>;

  const productId = params?.id as string;
  const { data } = useGetComboProductDetail(Number(productId));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [productId]);
  const productData = useMemo(
    () =>
      data
        ? ({
            ...data?.result,
            similerProduct: data?.similarComboProducts,
          } as ProductDetailType)
        : null,
    [data]
  );

  if (!data || !productData) return <></>;

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
          <ProductDetail product={productData} isCombo />
        </div>
      </div>
      <div className="h-[2px] w-full bg-gray-200 my-10"></div>
      <ProductFooter product={productData} isCombo={true} />
    </CustomPageWrapper>
  );
}


