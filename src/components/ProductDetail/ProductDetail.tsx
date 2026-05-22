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
  isCombo = false,
}: {
  product: ProductDetailType;
  isCombo?: boolean;
}) {
  const variants = product?.varients || [];
  const [selectedVarientId, setSelectedVarientId] = useState(
    variants?.[0]?.id ?? 0
  );
  const [selectedFlavour, setSelectedFlavour] = useState(
    getVariantFlavors(variants?.[0])?.[0] || ""
  );
  const selectedVarient =
    variants?.find((varient) => varient.id === selectedVarientId) ||
    variants?.[0];
  const selectedVariantPricing = resolveVariantSelection(
    selectedVarient,
    selectedFlavour
  );
  const deliveryPrice = isCombo
    ? Number(product?.sellingPrice ?? product?.price ?? 0)
    : Number(selectedVariantPricing?.sellingPrice || 0);

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
        isCombo={isCombo}
      />
      {!isCombo && (
        <ProductVarient
          product={product}
          selectedFlavour={selectedFlavour}
          selectedVarientId={selectedVarientId}
          setSelectedFlavour={setSelectedFlavour}
          setSelectedVarientId={setSelectedVarientId}
        />
      )}
      <ProductCouponOffers />
      <ProductDelivery 
        price={deliveryPrice}
        countryOfOrigin={product?.countryOfOrigin || product?.brandOriginCountry || undefined}
        countryCode={product?.brandOriginCountryCode || undefined}
        brandImportInfo={product?.brand}
      />
      <div className="lg:hidden w-full">
        <ProductBenefits id={product?.id} information={product?.information} />
      </div>
      <ProductBottomSheet
        product={product}
        selectedVarientId={selectedVarientId}
        selectedFlavour={selectedFlavour}
        isCombo={isCombo}
      />
    </div>
  );
}
