"use client";
import {
  BestsellerIcon,
  StarIcon,
  ThunderIcon,
  TrashIcon,
  WhishlistIcon,
} from "@/Icons";
import WishlistIconWhite from "@/Icons/WishlistIconWhite";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useAddToCartList } from "@/queries/Cart";
import { useAddToWishList, useRemoveFormWishList } from "@/queries/Product";
import { ProductDataType } from "@/utils/Types";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PrimaryButton from "../Buttons/PrimaryButton";
import {
  getFirstFlavorLabel,
  getVariantDiscountPercent,
  getVariantMarketPrice,
  getVariantSellingPrice,
  resolveVariantSelection,
} from "@/utils/variantPricing";
import { getFirstMediaUrl } from "@/utils/media";


type Props = {
  productData?: ProductDataType;
  pathname?: string;
  fullidth?: boolean;
  isOffer?: boolean;
  showBestsellerBadge?: boolean;
};

export default function ProductCard({
  productData,
  pathname,
  fullidth,
  isOffer,
  showBestsellerBadge,
}: Props) {
  const [product, setProduct] = useState(productData);
  const { userData } = useAppContext();
  const [isWishListed, setIsWishListed] = useState<boolean>(false);
  const router = useRouter();
  const urlPath = usePathname();
  const queryClient = useQueryClient();
  const { mutate: addToWishList } = useAddToWishList();
  const { mutate: removeFromWishList } = useRemoveFormWishList();
  const { mutate: addToCart, isPending } = useAddToCartList();
  const wishListData: any = queryClient.getQueryData(["wishlist"]);
  const isComboPath =
    pathname === "combo" ||
    Boolean((product as any)?.isCombo || (product as any)?.isLegacyComboProduct);

  // Function to record product as recently viewed
  const recordProductView = async (productId: number) => {
    if (!userData?.id) return;
    
    try {
      await axiosInstance.post('/recentViews', {
        userId: userData.id,
        productId: productId
      });
      
      // Invalidate recent views query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["recent-views", userData.id] });
    } catch (error) {
      console.error('Error recording product view:', error);
    }
  };

  useEffect(() => {
    const prod = wishListData?.filteredList?.find(
      (pro: any) =>
        pro.id === product?.id && Boolean(pro.isCombo) === Boolean(isComboPath)
    );
    setIsWishListed(Boolean(prod));
  }, [wishListData, product?.id, isComboPath]);

  const addWish = (e: any) => {
    e.stopPropagation();
    setIsWishListed(true);
    addToWishList(
      { productId: product?.id as number, userId: userData?.id as number, isCombo: isComboPath },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-Products"] });
          queryClient.invalidateQueries({ queryKey: ["wishlist"] });
          toast.success("Product added Successfully!!!");
        },
        onError: () => {
          if (!userData?.id) {
            toast.error("please login first...");
          } else {
            toast.error("something went wrong");
          }
          setIsWishListed(false);
        },
      }
    );
  };
  const removeWish = (e: any) => {
    e.stopPropagation();
    setIsWishListed(false);

    removeFromWishList(
      { productId: product?.id as number, userId: userData?.id as number, isCombo: isComboPath },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-Products"] });
          queryClient.invalidateQueries({ queryKey: ["wishlist"] });
          toast.success("Product removed Successfully!!!");
        },
        onError: () => {
          setIsWishListed(true);
        },
      }
    );
  };

  if (product) {
    const isCombo = isComboPath;
    const firstVariant = product?.varients?.[0];
    const firstFlavor = isCombo ? "Combo" : getFirstFlavorLabel(firstVariant);
    const firstVariantPricing = isCombo
      ? { mrp: product?.mrp || 0, sellingPrice: product?.sellingPrice ?? product?.price ?? 0 }
      : resolveVariantSelection(firstVariant, firstFlavor);
    const marketPrice = getVariantMarketPrice(firstVariantPricing);
    const sellingPrice = getVariantSellingPrice(firstVariantPricing);
    const discountPercent = getVariantDiscountPercent(firstVariantPricing);
    const link = isCombo
      ? `/combo/${product?.id}`
      : isOffer
        ? `${urlPath}/product/${encodeURIComponent(product?.name)}?productId=${product?.id}`
        : `/product/${encodeURIComponent(product?.name)}?id=${product?.id}`;
    return (
      <div
        className={`rounded-[15px] sm-3 relative shadow-lg min-h-[340px] max-h-[340px] flex flex-col  min-w-[220px] max-sm:w-[250px] p-3  border ${
          fullidth ? "max-sm:w-full" : ""
        } `}
      >
        <div className="flex items-center justify-center relative">
          <Image
            src={getFirstMediaUrl(product?.images)}
            alt={product?.name || "Product"}
            width={200}
            height={140}
            className="h-[140px] w-full max-w-[200px] cursor-pointer object-contain object-center mix-blend-multiply"
            onClick={() => {
              recordProductView(product?.id as number);
              router.push(link);
            }}
            unoptimized={true}
          />
          <div className="absolute bottom-1 left-0 flex items-center gap-1 bg-[#F7F7F7] bg-opacity-90 rounded-md px-2 py-1">
            <StarIcon width={14} height={14} />
            <span className="text-sm font-medium text-black">
              {product?.averageRating?.toFixed(1)}
            </span>
          </div>
        </div>
        <div>
         <div className="flex justify-between mt-2 gap-6">
           <p
            onClick={() => {
              recordProductView(product?.id as number);
              router.push(link);
            }}
            className="text-black line-clamp-2  not-italic font-semibold  cursor-pointer "
          >
            {product?.name}
          </p>
         </div>
          {!isCombo && (
            <p className="text-gray-600 text-xs">
              {firstFlavor}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between ">
          <div>
            {discountPercent > 0 && (
              <p className="text-black text-xs not-italic font-medium line-through opacity-40">
                ₹ {marketPrice.toFixed(0)}/-
              </p>
            )}
            <p className="text-black text-base not-italic font-bold">
              ₹ {sellingPrice.toFixed(0)}/-
            </p>
          </div>
          {(showBestsellerBadge || product?.isBestSeller) && (
            <div className="flex gap-1 items-center rounded-md bg-gray-100 px-2 py-1">
              <BestsellerIcon />
              <p className="text-gradient text-xs not-italic font-normal">
                Bestseller
              </p>
            </div>
          )}
        </div>
        {/* <div className="h-[1px] bg-black opacity-5 " /> */}
      <PrimaryButton
        className="w-full h-fit mt-auto"
        loading={isPending}
        onClick={() => {
          // First check if user is logged in
          if (!userData?.id) {
            toast.dismiss();
            toast.info("Please login to add products to cart");
            router.push('/login');
            return;
          }

          // Check if product has variants
          if (!isCombo && (!product?.varients || product.varients.length === 0)) {
            toast.dismiss();
            toast.error("This product is currently not available");
            return;
          }

          // Get the first variant and its first flavor
          const firstVariant = isCombo ? { id: 0 } : product.varients[0];
          const firstFlavor = isCombo ? "Combo" : getFirstFlavorLabel(firstVariant);

          addToCart(
            {
              user: userData.id,
              product: product?.id,
              qty: 1,
              flavour: firstFlavor,
              varientId: firstVariant.id,
              isCombo,
            },
            {
              onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["cart"] });
                toast.dismiss();
                toast.success("Product added to cart successfully!");
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
        }}
        label="Add to cart"
      />
        {discountPercent > 0 && (
          <p className="absolute top-0 left-0 text-green-500 text-xs not-italic font-bold bg-[#DFF3E2] p-2 rounded-br-[15px]">
            {discountPercent.toFixed(0)}% off
          </p>
        )}
     <button className="absolute top-3 right-3">
  {isWishListed ? (
    <div onClick={removeWish} className="cursor-pointer">
      {/* Always show the heart icon, even on wishlist page */}
      <WhishlistIcon />
    </div>
  ) : (
    <div onClick={addWish} className="cursor-pointer">
      <WishlistIconWhite />
    </div>
  )}
</button>
        {product?.isOnFlashSale && (
          <div className="absolute top-12 right-4">
            <ThunderIcon />
          </div>
        )}
      </div>
    );
  }
  return <></>;
}
