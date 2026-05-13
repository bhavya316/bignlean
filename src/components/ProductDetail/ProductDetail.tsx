"use client";
import { ProductDetailType } from "@/utils/productType";
import { useEffect, useState } from "react";
import { ProductBenefits } from "../ProductOverview/ProductOverview";
import ProductBottomSheet from "./ProductBottomSheet";
import ProductCouponOffers from "./ProductCouponOffers";
import ProductInfo from "./ProductInfo";
import ProductVarient from "./ProductVarient";
import ProductDelivery from "./ProductDelivery";
import { getVariantFlavors, resolveVariantSelection } from "@/utils/variantPricing";

export default function ProductDetail({
  product,
}: {
  product: ProductDetailType;
}) {
  const [selectedVarientId, setSelectedVarientId] = useState(
    product?.varients?.[0]?.id ?? 0
  );
  const [selectedFlavour, setSelectedFlavour] = useState(
    getVariantFlavors(product?.varients?.[0])?.[0] || ""
  );
  const selectedVarient =
    product?.varients?.find((varient) => varient.id === selectedVarientId) ||
    product?.varients?.[0];
  const selectedVariantPricing = resolveVariantSelection(
    selectedVarient,
    selectedFlavour
  );

  useEffect(() => {
    const flavors = getVariantFlavors(selectedVarient);
    if (flavors.length > 0 && !flavors.includes(selectedFlavour)) {
      setSelectedFlavour(flavors[0]);
    }
  }, [selectedVarientId, selectedFlavour, selectedVarient]);

  return (
    <div className="flex flex-col gap-[32px] max-lg:gap-6">
      <ProductInfo
        product={product}
        selectedVarientId={selectedVarientId}
        selectedFlavour={selectedFlavour}
      />
      <ProductVarient
        product={product}
        selectedFlavour={selectedFlavour}
        selectedVarientId={selectedVarientId}
        setSelectedFlavour={setSelectedFlavour}
        setSelectedVarientId={setSelectedVarientId}
      />
      <ProductCouponOffers />
      <ProductDelivery 
        price={Number(selectedVariantPricing?.sellingPrice || 0)}
        countryOfOrigin={product?.countryOfOrigin || product?.brandOriginCountry || undefined}
        countryCode={product?.brandOriginCountryCode || undefined}
      />
      <div className="lg:hidden w-full">
        <ProductBenefits id={product?.id} information={product?.information} />
      </div>
      <ProductBottomSheet
        product={product}
        selectedVarientId={selectedVarientId}
        selectedFlavour={selectedFlavour}
      />
    </div>
  );
}
