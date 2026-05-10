// filepath: src/app/(site)/comparison/page.tsx
"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const ComparePage = dynamic(() => import("@/components/compare"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComparePage />
    </Suspense>
  );
}

// import dynamic from "next/dynamic";
// const ComparePage = dynamic(import("@/components/compare"), { ssr: false });
// export default function page() {
//   return <ComparePage />;
// }
