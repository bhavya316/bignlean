"use client";

import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { ProductDetailType } from "@/utils/productType";
import DetailCard from "./DetailCard";
import OverviewCard from "./OverviewCard";
import ProductCertificate from "./ProductCertificate";
import ReviewCard from "./ReviewCard";
import { SellerInfoCard } from "../ProductDetail/ProductDelivery";
// import SimilarProducts from "../ProductDetail/SimilarProducts";
import { SectionHeader, SliderWrapper } from "@/components";
// import { Categories } from "@/utils/Schemas";
import { SwiperSlide } from "swiper/react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import {
  BestsellerIcon,
  StarIcon,
  ThunderIcon,
  WhishlistIcon,
} from "@/Icons";
import WishlistIconWhite from "@/Icons/WishlistIconWhite";
import { useAddToCartList } from "@/queries/Cart";
import { useAddToWishList, useRemoveFormWishList } from "@/queries/Product";
import { ProductDataType } from "@/utils/Types";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  productData?: ProductDataType | ProductDetailType;
  pathname?: string;
  fullidth?: boolean;
  isOffer?: boolean;
};
export function SimilarProductCard({
  productData,
  pathname,
  fullidth,
  isOffer,
}: Props) {
  const [product, setProduct] = useState<ProductDataType | ProductDetailType | undefined>(productData);
  const { userData } = useAppContext();
  const [isWishListed, setIsWishListed] = useState<boolean>(false);
  const router = useRouter();
  const urlPath = usePathname();
  const queryClient = useQueryClient();
  const { mutate: addToWishList } = useAddToWishList();
  const { mutate: removeFromWishList } = useRemoveFormWishList();
  const { mutate: addToCart, isPending } = useAddToCartList();
  const wishListData: any = queryClient.getQueryData(["wishlist"]);
  const isComboProduct =
    pathname === "combo" ||
    Boolean((product as any)?.isCombo || (product as any)?.isLegacyComboProduct);

  useEffect(() => {
    const prod = wishListData?.filteredList?.find(
      (pro: any) =>
        pro.id === product?.id && Boolean(pro.isCombo) === Boolean(isComboProduct)
    );
    setIsWishListed(Boolean(prod));
  }, [wishListData, product?.id, isComboProduct]);

  const addWish = (e: any) => {
    e.stopPropagation();
    setIsWishListed(true);
    addToWishList(
      { productId: product?.id as number, userId: userData?.id as number, isCombo: isComboProduct },
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

  const addCartHandler = () => {
    // First check if user is logged in
    if (!userData?.id) {
      toast.dismiss();
      toast.info("Please login to add products to cart");
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }
    if (!product?.id) return;

    // Regular products need variants. Combo products use combo-level pricing.
    if (!isComboProduct && (!product?.varients || product.varients.length === 0)) {
      toast.dismiss();
      toast.error("This product is currently not available");
      return;
    }

    const firstVariant = product?.varients?.[0];
    const firstFlavor = isComboProduct ? "Combo" : getFirstFlavorLabel(firstVariant);

    addToCart(
      {
        user: userData.id,
        product: product.id,
        qty: 1,
        flavour: firstFlavor,
        varientId: isComboProduct ? 0 : firstVariant?.id ?? 0,
        isCombo: isComboProduct,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success("Product added Successfully!!!");
        },
        onSettled: () => {
          // Handle settled state if needed
        },
      }
    );
  };
  const removeWish = (e: any) => {
    e.stopPropagation();
    setIsWishListed(false);

    removeFromWishList(
      { productId: product?.id as number, userId: userData?.id as number, isCombo: isComboProduct },
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
    const firstVariant = product?.varients?.[0];
    const firstFlavor = isComboProduct ? "Combo" : getFirstFlavorLabel(firstVariant);
    const firstVariantPricing = isComboProduct
      ? { mrp: product?.mrp || 0, sellingPrice: product?.sellingPrice ?? product?.price ?? 0 }
      : resolveVariantSelection(firstVariant, firstFlavor) || product;
    const marketPrice = getVariantMarketPrice(firstVariantPricing);
    const sellingPrice = getVariantSellingPrice(firstVariantPricing);
    const discountPercent = getVariantDiscountPercent(firstVariantPricing);
    const maxQuantity = Number(firstVariantPricing?.stock || 0);
    const isOutOfStock = !isComboProduct && maxQuantity <= 0;
    const link = isComboProduct
      ? `/combo/${product?.id}`
      : isOffer
        ? `${urlPath}/product/${encodeURIComponent(product?.name)}?productId=${product?.id}`
        : `/product/${encodeURIComponent(product?.name)}?id=${product?.id}`;
    return (
      <div
        className={`rounded-[15px] sm-3 relative shadow-lg min-h-[340px] max-h-[340px] flex flex-col  min-w-[220px] max-sm:w-[250px] p-3  border ${fullidth ? "max-sm:w-full" : ""
          } `}
      >
        <div className="flex items-center justify-center">
          <NextImage
            src={getFirstMediaUrl(product?.images)}
            alt={product?.name || "Product"}
            width={200}
            height={140}
            className="object-contain object-center w-auto h-[140px] cursor-pointer mix-blend-multiply"
            onClick={() => router.push(link)}
            unoptimized={true}
          />
        </div>
        <div>
          <div className="flex justify-between mt-2 ">
            <p
              onClick={() => router.push(link)}
              className="text-black line-clamp-2  not-italic font-semibold  cursor-pointer"
            >
              {product?.name}
            </p>
          </div>
          {!isComboProduct && (
            <p className="text-gray-600 text-xs">
              {firstFlavor}
            </p>
          )}
        </div>
        <div className="flex font-medium text-sm items-center gap-1">
          <StarIcon width={15} height={15} />{" "}
          {product?.averageRating?.toFixed(1)}
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
          {Boolean(product?.isBestSeller) && (
            <div className="flex gap-1 items-center rounded-md bg-gray-100 px-2 py-1">
              <BestsellerIcon />
              <p className="text-gradient text-xs not-italic font-normal">
                Bestseller
              </p>
            </div>
          )}
        </div>
        <div className="h-[1px] bg-black opacity-5 " />
        <PrimaryButton
          className="w-full h-fit mt-auto"
          loading={isPending}
          disable={isOutOfStock}
          onClick={addCartHandler}
          label={isOutOfStock ? "OUT OF STOCK" : "Add to cart"}
        />
        {discountPercent > 0 && (
          <p className="absolute top-0 left-0 text-green-500 text-xs not-italic font-bold bg-[#DFF3E2] p-2 rounded-br-[15px]">
            {discountPercent.toFixed(0)}% off
          </p>
        )}
        <button className="absolute top-3 right-3">
          {isWishListed ? (
            <div onClick={removeWish}>
           <WhishlistIcon />
            </div>
          ) : (
            <div onClick={addWish}>
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

export default function ProductFooter({
  product,
  isCombo = false,
}: {
  product: ProductDetailType;
  isCombo?: boolean;
}) {
  const [activeTab, setActiveTab] = useState("Overview"); // State to track active tab
  const overviewRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement | null>,
    tab: string
  ) => {
    setActiveTab(tab); // Update active tab
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col gap-5">
       
<div className="p-2">
<div className="p-2 flex items-center w-[700px] max-[700px]:w-full max-[700px]:flex-wrap rounded-lg bg-gray-100 shadow-sm">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => {
        if (tab === "Overview") scrollToSection(overviewRef, tab);
        if (tab === "Details") scrollToSection(detailsRef, tab);
        if (tab === "Certificate") scrollToSection(certificateRef, tab);
        if (tab === "Reviews") scrollToSection(reviewsRef, tab);
      }}
      className={` flex-1 ${
        activeTab === tab ? "tab-active" : ""
      }`}
    >
      <p
        className={
          activeTab === tab
            ? "p-2 text-[#E70F0F] bg-white rounded-lg shadow-sm"
            : "p-2 border-3 border-transparent rounded-xl text-gray-600"
        }
      >
        {tab}
      </p>
    </button>
  ))}
</div>
</div>


        {/* Overview Section */}
        <div ref={overviewRef}>
          {/* <h2 className="text-2xl font-bold">Overview</h2> */}
          <OverviewCard overview={product?.overView} />
        </div>

        {/* Details Section */}
        <div ref={detailsRef}>
          {/* <h2 className="text-2xl font-bold">Details</h2> */}
          <DetailCard
            details={product?.details}
            information={product?.tables}
            supplements={product?.supplements}
          />
        </div>

        <SellerInfoCard brandImportInfo={product?.brand} />

        {/* Certificate Section */}
        <div ref={certificateRef}>
          {/* <h2 className="text-2xl font-bold">Certificate</h2> */}
          <ProductCertificate certificates={product?.certificates} />
        </div>

        {/* Reviews Section */}
        <div ref={reviewsRef}>
          {/* <h2 className="text-2xl font-bold">Reviews</h2> */}
          <ReviewCard product={product} />
        </div>

        {/* Similar Products Section */}
        {product?.similerProduct && product.similerProduct.length > 0 && (
          <div>
            <div className="w-[1200px] mx-auto mt-[20px] max-[1200px]:w-full flex flex-col gap-[10px]">
              <SectionHeader
                label={`Similar Products `}
                showBtn
                btnLabel="View all"
              />
              <SliderWrapper slidePerView={4}>
                {product.similerProduct.slice(0, 4).map((similarProduct, index) => (
                  <SwiperSlide key={similarProduct.id || index} className="min-h-full min-w-[200px]">
                    <SimilarProductCard
                      productData={similarProduct}
                      pathname={isCombo ? "combo" : "product"}
                      fullidth={true}
                      isOffer={false}
                    />
                  </SwiperSlide>
                ))}
              </SliderWrapper>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const tabs = ["Overview", "Details", "Certificate", "Reviews"];

// const ProductTab = () => {
//   const [activeTab, setActiveTab] = useState("Overview");

//   return (
//     <div className="flex items-center w-full max-w-[700px] rounded-lg bg-[#F9F9F9] shadow-sm overflow-hidden">
//   {tabs.map((tab) => (
//     <button
//       key={tab}
//       onClick={() => {
//         if (tab === "Overview") scrollToSection(overviewRef, tab);
//         if (tab === "Details") scrollToSection(detailsRef, tab);
//         if (tab === "Certificate") scrollToSection(certificateRef, tab);
//         if (tab === "Reviews") scrollToSection(reviewsRef, tab);
//       }}
//       className={`relative text-base flex-1 transition-all duration-200 ${
//         activeTab === tab ? "z-10" : ""
//       }`}
//     >
//       <div
//         className={`
//           py-3 px-2 text-center transition-all duration-200
//           ${activeTab === tab 
//             ? "text-[#E70F0F] bg-white font-semibold rounded-t-lg shadow-tab" 
//             : "text-gray-600"}
//         `}
//       >
//         {tab}
//         {activeTab === tab && (
//           <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E70F0F]"></div>
//         )}
//       </div>
//     </button>
//   ))}
// </div>
//   );
// };
