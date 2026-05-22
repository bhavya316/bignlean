"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CategorySubcategoryRedirect({ params }: { 
  params: { categoryId: string, subcategoryId: string } 
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the proper URL format
    router.replace(`/shop-by-brands?category=${params.categoryId}&subcategory=${params.subcategoryId}`);
  }, [params.categoryId, params.subcategoryId, router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Redirecting to the proper page...</p>
    </div>
  );
}
