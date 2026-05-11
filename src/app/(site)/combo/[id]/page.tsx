"use client";
import { ProductDetail, ProductFooter, ProductOverview } from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useGetComboProductDetail } from "@/queries/dataHandlers";
import { ProductDetailType } from "@/utils/productType";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getVariantMarketPrice,
  getVariantSellingPrice,
} from "@/utils/variantPricing";

export default function Page() {
  const params = useParams();

  if (!params) return <></>;

  const productId = params?.id as string;
  const { data } = useGetComboProductDetail(Number(productId));
  const [selectedAddOnId, setSelectedAddOnId] = useState<number | null>(null);

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
  const addOnOptions = useMemo(
    () => data?.similarComboProducts || [],
    [data?.similarComboProducts]
  );

  useEffect(() => {
    setSelectedAddOnId(addOnOptions?.[0]?.id ?? null);
  }, [productId, addOnOptions]);

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
          <ProductDetail product={productData} />
        </div>
      </div>
      <ComboSelectionSummary
        product={productData}
        addOnOptions={addOnOptions}
        selectedAddOnId={selectedAddOnId}
        setSelectedAddOnId={setSelectedAddOnId}
      />
      <div className="h-[2px] w-full bg-gray-200 my-10"></div>
      <ProductFooter product={productData} isCombo={true} />
    </CustomPageWrapper>
  );
}

function ComboSelectionSummary({
  product,
  addOnOptions,
  selectedAddOnId,
  setSelectedAddOnId,
}: {
  product: ProductDetailType;
  addOnOptions: any[];
  selectedAddOnId: number | null;
  setSelectedAddOnId: (id: number) => void;
}) {
  const selectedAddOn = addOnOptions.find(
    (item: any) => item.id === selectedAddOnId
  );
  const selectedProducts = selectedAddOn ? [product, selectedAddOn] : [product];
  const hasTwoProducts = selectedProducts.length === 2;
  const totalMrp = selectedProducts.reduce(
    (sum, item: any) => sum + getVariantPrice(item, "mrp"),
    0
  );
  const totalSellingPrice = selectedProducts.reduce(
    (sum, item: any) => sum + getVariantPrice(item, "sellingPrice"),
    0
  );
  const savings = Math.max(totalMrp - totalSellingPrice, 0);
  const savingsPercent =
    totalMrp > 0 ? Math.round((savings / totalMrp) * 100) : 0;

  return (
    <section className="mt-8 rounded-lg border border-black/10 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black">
          Combo Selection
        </h2>
        <span
          className={`rounded-md px-3 py-1 text-sm font-semibold ${
            hasTwoProducts
              ? "bg-green-50 text-green-700"
              : "bg-orange-50 text-orange-700"
          }`}
        >
          {selectedProducts.length}/2 selected
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ComboSelectionCard product={product} selected locked />
        {addOnOptions.map((option: any) => (
          <ComboSelectionCard
            key={option.id}
            product={option}
            selected={option.id === selectedAddOnId}
            onClick={() => setSelectedAddOnId(option.id)}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
        <div>
          <p className="text-sm font-medium text-gray-600">Combo total</p>
          <p className="text-xl font-bold text-black">
            ₹{hasTwoProducts ? totalSellingPrice.toFixed(0) : "--"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">Discount applied</p>
          <p className="text-base font-semibold text-green-700">
            {hasTwoProducts
              ? `You save ₹${savings.toFixed(0)} (${savingsPercent}% off)`
              : "Select one more product"}
          </p>
        </div>
      </div>
    </section>
  );
}

function ComboSelectionCard({
  product,
  selected,
  locked = false,
  onClick,
}: {
  product: any;
  selected: boolean;
  locked?: boolean;
  onClick?: () => void;
}) {
  const sellingPrice = getVariantPrice(product, "sellingPrice");
  const marketPrice = getVariantPrice(product, "mrp");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      className={`flex min-h-[92px] w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
        selected
          ? "border-red-500 bg-red-50"
          : "border-black/10 bg-white hover:border-red-300"
      } ${locked ? "cursor-default" : "cursor-pointer"}`}
    >
      <img
        src={product?.images?.[0] || "/placeholder-product.png"}
        alt={product?.name || "Combo product"}
        className="h-16 w-16 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold text-black">
          {product?.name}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold text-black">
            ₹{sellingPrice.toFixed(0)}
          </span>
          {marketPrice > sellingPrice && (
            <span className="text-xs text-gray-500 line-through">
              ₹{marketPrice.toFixed(0)}
            </span>
          )}
        </div>
      </div>
      <span
        className={`h-4 w-4 rounded-full border ${
          selected ? "border-red-600 bg-red-600" : "border-gray-300"
        }`}
      />
    </button>
  );
}

function getVariantPrice(product: any, key: "mrp" | "sellingPrice") {
  const variant = product?.varients?.[0];
  if (!variant) return 0;

  if (key === "mrp") {
    return getVariantMarketPrice(variant);
  }

  return getVariantSellingPrice(variant);
}
