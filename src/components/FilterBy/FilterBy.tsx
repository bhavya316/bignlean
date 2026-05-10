"use client";
import CustomFilter, { CustomRadioFilter } from "./CustomFilter";
import { useGetAllBrands, useGetRelatedProducts } from "@/queries/dataHandlers";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_CONFIG } from "@/config/api";

// Define the radio filter constants (keep your existing constants)
const radioFilterPrice = [
  { value: "0 - 99999", label: "0 - above" },
  { value: "500 - 1500", label: "500 - 1500" },
  { value: "1500 - 3000", label: "1500 - 3000" },
  { value: "3000 - 7000", label: "3000 - 7000" },
  { value: "7000 & 99999", label: "7000 & above" },
];

const radioFilterRating = [
  { value: "4", label: "4 Ratings & above" },
  { value: "3", label: "3 Ratings & above" },
  { value: "2", label: "2 Ratings & above" },
  { value: "1", label: "1 Ratings & above" },
  { value: "0", label: "any" },
];

const radioFilterDiscount = [
  { value: "0", label: "0% and above" },
  { value: "20", label: "20% and above" },
  { value: "30", label: "30% and above" },
  { value: "40", label: "40% and above" },
];

export default function FilterBy({ 
  selectedCategoryId,
  selectedCategoryName,
  displayedProducts = [] // Add this new prop
}: { 
  selectedCategoryId?: number | null,
  selectedCategoryName?: string | null,
  displayedProducts?: any[] // Define the type
}) {
  const { data: brandsData } = useGetAllBrands();
  const brandsId = brandsData?.brands?.map((brand: any) => brand?.name);
  
  // Get context but don't directly destructure the function with the type error
  const context = useAppContext();
  const { filterProductsParams, selectedBrands } = context;
  
  // State for excluded out of stock products
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(false);
  
  // State for related products
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(false);
  const [sourceProductName, setSourceProductName] = useState<string>("");
  
  // Extract brandId from selectedBrands
  const brandId = useMemo(() => {
    if (selectedBrands && typeof selectedBrands === 'string') {
      if (selectedBrands.includes('=')) {
        const extractedId = selectedBrands.split('=')[1];
        return extractedId;
      }
      if (!selectedBrands.includes('&')) {
        return selectedBrands;
      }
    }
    return null;
  }, [selectedBrands]);

  // Function to fetch related products for a specific product ID
  const fetchRelatedProducts = async (productId: number) => {
    try {
      setLoadingRelatedProducts(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/related-products?productId=${productId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status && Array.isArray(data.relatedProducts)) {
        return data.relatedProducts;
      } else {
        console.error("Invalid response format for related products:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  };
  
  // Fetch related products based on currently displayed products
  useEffect(() => {
    const fetchProductsAndRelated = async () => {
      setLoadingRelatedProducts(true);
      try {
        // Get source products - use the displayed products if available
        let sourceProducts: any[] = [];
        
        if (displayedProducts && displayedProducts.length > 0) {
          // Use the displayedProducts as source
          sourceProducts = displayedProducts.slice(0, 3);
        } else if (selectedCategoryId) {
          // Fallback to fetching by category if no displayed products
          const categoryResponse = await fetch(`${API_CONFIG.BASE_URL}/admin/products-by-category?catId=${selectedCategoryId}`);
          
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            if (categoryData.status && Array.isArray(categoryData.products) && categoryData.products.length > 0) {
              sourceProducts = categoryData.products.slice(0, 3);
            }
          }
        } else {
          // Fallback to featured products if no category and no displayed products
          const response = await fetch(`${API_CONFIG.BASE_URL}/admin/products?limit=3`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.status && Array.isArray(data.products)) {
              sourceProducts = data.products.slice(0, 3);
            }
          }
        }
        
        // If we have source products, fetch their related products
        if (sourceProducts.length > 0) {
          // Use the first product to fetch related products
          const productId = sourceProducts[0].id;
          // Save source product name for display
          setSourceProductName(sourceProducts[0].name || "");
          
          console.log(`Fetching related products for product ID: ${productId}`);
          
          const relatedData = await fetchRelatedProducts(productId);
          
          if (relatedData.length > 0) {
            setRelatedProducts(relatedData.slice(0, 3));
          } else {
            // Fallback to source products if no related products
            setRelatedProducts(sourceProducts.slice(0, 3));
          }
        } else {
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error("Error in related products flow:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelatedProducts(false);
      }
    };
    
    fetchProductsAndRelated();
  }, [displayedProducts, selectedCategoryId]);
  
  // Handle out of stock checkbox change - keep existing code
  const handleOutOfStockChange = (checked: boolean) => {
    // ... existing code ...
  };

  // Handle retry for related products
  const handleRetryRelatedProducts = () => {
    const fetchProductsAndRelated = async () => {
      setLoadingRelatedProducts(true);
      try {
        // Get source products based on displayed products
        let sourceProducts: any[] = [];
        
        if (displayedProducts && displayedProducts.length > 0) {
          sourceProducts = displayedProducts.slice(0, 3);
        } else if (selectedCategoryId) {
          // Fallback to category if no displayed products
          const categoryResponse = await fetch(`${API_CONFIG.BASE_URL}/admin/products-by-category?catId=${selectedCategoryId}`);
          
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            if (categoryData.status && Array.isArray(categoryData.products) && categoryData.products.length > 0) {
              sourceProducts = categoryData.products.slice(0, 3);
            }
          }
        } else {
          // Fallback to featured products as a last resort
          const response = await fetch(`${API_CONFIG.BASE_URL}/admin/products?limit=3`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.status && Array.isArray(data.products)) {
              sourceProducts = data.products.slice(0, 3);
            }
          }
        }
        
        // If we have source products, fetch their related products
        if (sourceProducts.length > 0) {
          // Try multiple products if available
          for (let i = 0; i < Math.min(sourceProducts.length, 3); i++) {
            const productId = sourceProducts[i].id;
            // Update source product name
            setSourceProductName(sourceProducts[i].name || "");
            
            console.log(`Trying related products for product ID: ${productId}`);
            
            const relatedData = await fetchRelatedProducts(productId);
            
            if (relatedData.length > 0) {
              setRelatedProducts(relatedData.slice(0, 3));
              break; // Stop if we found related products
            }
            
            // If we've tried all source products and found nothing, use source products
            if (i === Math.min(sourceProducts.length, 3) - 1) {
              setRelatedProducts(sourceProducts.slice(0, 3));
            }
          }
        } else {
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error("Error in retry related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelatedProducts(false);
      }
    };
    
    fetchProductsAndRelated();
  };

  // Rest of the component remains unchanged

  const brandOptions = brandsData?.brands?.map((brand: any) => brand?.name) || [];
  
  return (
    <div className="max-[1000px]:hidden">
      <h2 className="mb-5">Filter By</h2>
      <div className="flex flex-col gap-3">
        <CustomFilter filterOptions={["Bestseller"]} />
        
        <CustomFilter heading="By Brand" filterOptions={brandOptions} search />
        
        <CustomRadioFilter
          heading="Discount"
          radioFilters={radioFilterDiscount}
          paramName="discountPercent"
        />
        <CustomRadioFilter
          heading="Ratings"
          radioFilters={radioFilterRating}
          paramName="minRating"
        />
        <CustomRadioFilter
          heading="Price"
          radioFilters={radioFilterPrice}
          paramName="priceRanges[]"
        />

        {/* Out of stock checkbox */}
        <div className="border rounded-md p-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeOutOfStock"
              checked={excludeOutOfStock}
              onChange={(e) => handleOutOfStockChange(e.target.checked)}
              className="w-4 h-4 accent-red-600"
            />
            <label htmlFor="excludeOutOfStock" className="text-sm">
              Exclude out of stock
            </label>
          </div>
        </div>

        {/* Related Products section - updated title */}
        <div className="border rounded-md mt-2">
          <div className="p-3 border-b">
            <h3 className="text-sm font-medium">
              Related Products
              {sourceProductName 
                ? ` (Similar to ${sourceProductName.substring(0, 15)}${sourceProductName.length > 15 ? '...' : ''})` 
                : " (Featured)"}
            </h3>
          </div>
          <div className="p-3">
            {loadingRelatedProducts ? (
              <div className="flex justify-center items-center py-4">
                <p className="text-xs text-gray-500">Loading products...</p>
              </div>
            ) : relatedProducts && relatedProducts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {relatedProducts.slice(0, 3).map((product: any, index: number) => (
                  <Link 
                    href={`/product/${encodeURIComponent(product.name || '')}?id=${product.id}`} 
                    key={index}
                  >  
                    <div className="flex gap-2 items-center hover:bg-gray-50 p-1 rounded">
                      <div className="w-16 h-16 relative bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name || 'Product'}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.name || 'Product'}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs line-clamp-2">{product.name}</p>
                        <p className="text-xs font-semibold mt-1">
                          ₹{product.varients?.[0]?.sellingPrice || product.price || "N/A"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-xs text-gray-500">No related products found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {sourceProductName 
                    ? `Similar to ${sourceProductName.substring(0, 15)}${sourceProductName.length > 15 ? '...' : ''}` 
                    : 'For featured products'}
                </p>
                <button 
                  onClick={handleRetryRelatedProducts}
                  className="text-xs text-blue-500 mt-1 cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
