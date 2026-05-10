"use client";
import { CrossIcon } from "@/Icons";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import BreadCrumbs from "@/components/breadcrumbs/BreadCrumbs";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetProductDetail } from "@/queries/Cart";
import { useAddToCartList } from "@/queries/Cart";
import { useGetAllProducts } from "@/queries/dataHandlers";
import { ProductDataType } from "@/utils/Types";
import { ProductDetailType } from "@/utils/productType";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export default function ComparePage() {
  const params = useSearchParams();
  
  if (!params) return null;
  
  const productId = params.get("productId");
  const { data } = useGetAllProducts({});
  const [productA, setProductA] = useState<any>(null);
  const [productB, setProductB] = useState(null);
  const [fullProductA, setFullProductA] = useState<ProductDetailType | null>(null);
  const [fullProductB, setFullProductB] = useState<ProductDetailType | null>(null);

  useEffect(() => {
    if (productId && data) {
      const defaultProduct = (data?.products as ProductDataType[])?.find(
        (product) => product.id === Number(productId)
      );
      const filterData = {
        price: defaultProduct?.varients?.[0]?.sellingPrice,
        weight: defaultProduct?.varients?.[0]?.units,
        brand: defaultProduct?.brand?.heading,
        rating: defaultProduct?.averageRating,
      };
      defaultProduct?.overView?.forEach((item: any) => {
        //@ts-ignore
        filterData[item?.nutrients] = item.value;
      });

      setProductA(filterData);
    }
  }, [productId, data]);
  
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 font-montserrat">
      <BreadCrumbs />
      
      <h1 className="text-2xl font-bold my-6">Comparison</h1>
      
      <div className="flex items-center pb-8">
        <div className="w-1/3"></div>
        <ProductsCompareInfo
          products={data?.products}
          defaultProductId={productId}
          setProductData={setProductA}
          setFullProduct={setFullProductA}
        />
        <ProductsCompareInfo
          products={data?.products}
          defaultProductId={null}
          setProductData={setProductB}
          setFullProduct={setFullProductB}
        />
      </div>

      {(productA || productB) && (
        <ComparisonTable 
          productA={productA} 
          productB={productB}
          fullProductA={fullProductA}
          fullProductB={fullProductB}
        />
      )}
    </div>
  );
}

export const ProductsCompareInfo = ({
  products,
  setProductData,
  defaultProductId = null,
  setFullProduct,
}: {
  products: ProductDataType[];
  setProductData: any;
  defaultProductId: any;
  setFullProduct: any;
}) => {
  const [showList, setShowList] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { userData } = useAppContext();
  const [product, setProduct] = useState<number | null>(defaultProductId);
  const { data, dataUpdatedAt } = useGetProductDetail(
    product as number,
    userData?.id as number
  );

  const allFilterData: any[] = useMemo(
    () =>
      products?.filter((product: any) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      ) ?? [],
    [dataUpdatedAt, data, searchValue, products]
  );

  useEffect(() => {
    if (data) {
      const product: ProductDetailType = data?.data?.result;
      const filterData = {
        price: product?.varients?.[0]?.sellingPrice,
        weight: product?.varients?.[0]?.units,
        brand: product?.brand?.heading,
        rating: product?.averageRating,
      };
      product?.overView?.forEach((item: any) => {
        //@ts-ignore
        filterData[item?.nutrients] = item.value;
      });

      setProductData(filterData);
      setFullProduct(product);
    } else {
      setFullProduct(null);
    }
  }, [dataUpdatedAt, data, setProductData, setFullProduct]);

  return (
    <div className="w-1/3 flex items-center justify-center p-2">
      {product ? (
        <ProductCard
          productsDetails={data?.data?.result}
          setProduct={setProduct}
          setProductData={setProductData}
        />
      ) : (
        <div className="relative mx-auto border rounded-md w-full max-w-[200px]">
          <input
            placeholder="Search products"
            type="search"
            onFocus={() => {
              setShowList(true);
            }}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-none outline-none bg-white p-2 w-full rounded-md"
          />
          {allFilterData.length > 0 && showList && (
            <div className="w-full py-1 bg-white border absolute max-h-[300px] overflow-y-auto shadow-md top-full left-0 z-10">
              {allFilterData.map((product, index) => (
                <div
                  onClick={() => {
                    setProduct(product?.id);
                    setShowList(false);
                  }}
                  key={index}
                  className="w-full grid grid-cols-[max-content_1fr] gap-3 items-center text-start p-2 cursor-pointer hover:bg-gray-100"
                >
                  <div>
                    <img
                      src={product?.images[0]}
                      alt={product?.name}
                      className="aspect-square w-12 h-12 rounded-lg"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="line-clamp-2">{product?.name}</p>
                    <p className="font-light text-gray-500">
                      {product?.varients?.[0]?.units}-
                      {product?.varients?.[0]?.flavor?.[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ProductCard = ({
  setProduct,
  setProductData,
  productsDetails,
}: {
  setProduct: any;
  setProductData: any;
  productsDetails: any;
}) => {
  return (
    <div className="flex flex-col items-center h-full">
      <div className="relative shadow-md border rounded-lg bg-white p-3 w-[200px] max-[500px]:w-full mb-2">
        <img
          src={productsDetails?.images?.[0]}
          alt="product"
          className="w-full h-full max-w-[250px] aspect-square object-contain"
        />
        <button
          onClick={() => {
            setProduct(null);
            setProductData(null);
          }}
          className="absolute top-1 right-1"
        >
          <CrossIcon />
        </button>
      </div>
      <h3 className="text-black text-center text-lg max-sm:text-xs font-semibold mb-1">
        {productsDetails?.name?.slice(0, 30)}
        {productsDetails?.name?.length > 30 ? "..." : ""}
      </h3>
      <p className="text-black text-base flex max-sm:text-xs items-center gap-2 font-normal">
        <span>{productsDetails?.weight}</span>
        <span>{productsDetails?.flavor}</span>
      </p>
    </div>
  );
};

export const ComparisonTable = ({
  productA = {},
  productB = {},
  fullProductA,
  fullProductB,
}: {
  productA: any;
  productB: any;
  fullProductA: ProductDetailType | null;
  fullProductB: ProductDetailType | null;
}) => {
  const { userData } = useAppContext();
  const { mutate: addToCart, isPending: isPendingA } = useAddToCartList();
  const { mutate: addToCartB, isPending: isPendingB } = useAddToCartList();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get all keys from both products
  const allKeys = Array.from(
    new Set([
      ...(productA ? Object.keys(productA) : []),
      ...(productB ? Object.keys(productB) : []),
    ])
  );
  
  // Define common properties that should appear first (if they exist in the data)
  const commonProperties = ["brand", "price", "rating", "weight"];
  
  // Order the keys: common properties first, then any remaining properties
  const orderedKeys = [
    ...commonProperties.filter(key => allKeys.includes(key)),
    ...allKeys.filter(key => !commonProperties.includes(key)),
  ];

  const handleAddToCart = (product: ProductDetailType, isProductA: boolean) => {
    // Check if user is logged in
    if (!userData?.id) {
      toast.dismiss();
      toast.info("Please login to add products to cart");
      router.push('/login');
      return;
    }

    // Check if product has variants
    if (!product?.varients || product.varients.length === 0) {
      toast.dismiss();
      toast.error("This product is currently not available");
      return;
    }

    // Get the first variant and its first flavor
    const firstVariant = product.varients[0];
    const firstFlavor = firstVariant?.flavor?.[0] || "";

    // Debug log
    console.log("Adding to cart from comparison:", {
      product: product.name,
      variant: firstVariant,
      flavor: firstFlavor
    });
    
    const addToCartFunction = isProductA ? addToCart : addToCartB;
    
    addToCartFunction(
      {
        user: userData.id,
        product: product?.id,
        qty: 1,
        flavour: firstFlavor,
        varientId: firstVariant.id,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.dismiss();
          toast.success(`${product.name || 'Product'} added to cart successfully!`);
        },
        onError: (error: any) => {
          console.error("Cart error:", error);
          toast.dismiss();
          
          // Handle specific error messages from the server
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to add product to cart. Please try again.");
          }
        }
      }
    );
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="w-full border-separate border-spacing-0">
        <tbody>
          {orderedKeys.map((key, index) => (
            <tr 
              key={key} 
              className="border-b border-gray-200"
            >
              <td className="w-1/3 p-4 font-bold text-base capitalize border-r border-gray-200 bg-gray-50 text-black">
                {key}
              </td>
              <td className={`w-1/3 p-4 border-r border-gray-200 text-center ${
                key.toLowerCase() === "price"
                  ? "text-[#E70F0F] font-semibold"
                  : "text-black"
              }`}>
                {productA && productA[key] !== undefined ? (
                  <>
                    {key.toLowerCase() === "price" && "₹"} 
                    {key.toLowerCase() === "rating" ? (
                      <div className="flex items-center justify-center gap-1">
                        <svg
                          className="w-5 h-5 text-[#E70F0F] fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-lg font-bold text-black">{productA[key]}</span>
                      </div>
                    ) : (
                      productA[key]
                    )}
                  </>
                ) : (
                  "-"
                )}
              </td>
              <td className={`w-1/3 p-4 text-center ${
                key.toLowerCase() === "price"
                  ? "text-[#E70F0F] font-semibold"
                  : "text-black"
              }`}>
                {productB && productB[key] !== undefined ? (
                  <>
                    {key.toLowerCase() === "price" && "₹"} 
                    {key.toLowerCase() === "rating" ? (
                      <div className="flex items-center justify-center gap-1">
                        <svg
                          className="w-5 h-5 text-[#E70F0F] fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-lg font-bold text-black">{productB[key]}</span>
                      </div>
                    ) : (
                      productB[key]
                    )}
                  </>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
          
          {/* Add to Cart buttons row */}
          <tr>
            <td className="w-1/3 border-r border-gray-200 bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Actions</span>
            </td>
            <td className="w-1/3 border-r border-gray-200 h-20 align-middle">
              <div className="flex items-center justify-center h-full">
                {fullProductA ? (
                  <PrimaryButton
                    label="Add to Cart"
                    loading={isPendingA}
                    onClick={() => handleAddToCart(fullProductA, true)}
                    className="bg-[#E70F0F] text-white px-6 py-2 rounded-md hover:bg-[#C70E0E] transition-colors"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Select a product</span>
                )}
              </div>
            </td>
            <td className="w-1/3 h-20 align-middle">
              <div className="flex items-center justify-center h-full">
                {fullProductB ? (
                  <PrimaryButton
                    label="Add to Cart"
                    loading={isPendingB}
                    onClick={() => handleAddToCart(fullProductB, false)}
                    className="bg-[#E70F0F] text-white px-6 py-2 rounded-md hover:bg-[#C70E0E] transition-colors"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Select a product</span>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
