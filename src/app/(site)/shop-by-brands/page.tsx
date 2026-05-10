import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const ShopByBrandPage = dynamic(
  () => import("@/components/shop-by-brands/ShopByBrands"),
  {
    loading: () => <></>,
  }
);

export default function page() {
  return (
    <Suspense fallback={<></>}>
      <ShopByBrandPage />
    </Suspense>
  );
}
