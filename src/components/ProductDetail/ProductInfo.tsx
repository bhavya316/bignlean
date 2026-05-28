"use client";
import { ShareIcon, StarIcon, WhishlistIcon } from "@/Icons";
import WishlistIconWhite from "@/Icons/WishlistIconWhite";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { useAddToCartList } from "@/queries/Cart";
import {
  useAddToWishList,
  useGEtWishList,
  useRemoveFormWishList,
} from "@/queries/Product";
import { Varient } from "@/utils/Types";
import { ProductDetailType } from "@/utils/productType";
import {
  getVariantDiscountPercent,
  getVariantMarketPrice,
  getVariantSellingPrice,
  resolveVariantSelection,
} from "@/utils/variantPricing";
import { useQueryClient } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OutlinedButton } from "..";
import PrimaryButton from "../Buttons/PrimaryButton";

export default function ProductInfo({
  product,
  selectedVarientId,
  selectedFlavour,
  isCombo = false,
}: {
  product: ProductDetailType;
  selectedVarientId: number;
  selectedFlavour: string;
  isCombo?: boolean;
}) {
  const router = useRouter();
  const { mutate: addToCart } = useAddToCartList();
  const { userData } = useAppContext();
  const dispatch = useDispatchContext();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const varient = (product.varients || []).find(
    (varient) => varient.id === selectedVarientId
  );
  const selectedVariantPricing = isCombo
    ? {
        mrp: product?.mrp || 0,
        sellingPrice: product?.sellingPrice ?? product?.price ?? 0,
        stock: product?.stock ?? 999,
      }
    : resolveVariantSelection(varient, selectedFlavour);
  const maxQuantity = Number(selectedVariantPricing?.stock || 0);
  const isOutOfStock = maxQuantity <= 0;

  useEffect(() => {
    if (maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
    if (maxQuantity <= 0 && quantity !== 1) {
      setQuantity(1);
    }
  }, [maxQuantity, quantity]);

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

    if (isOutOfStock) {
      toast.dismiss();
      toast.error("Selected variant is out of stock");
      return;
    }

    setAdding(true);
    addToCart(
      {
        user: userData.id,
        product: product?.id,
        qty: quantity,
        flavour: isCombo ? "Combo" : selectedFlavour,
        varientId: isCombo ? 0 : selectedVarientId,
        isCombo,
      },
      {
        onSuccess: () => {
          toast.success("Product added Successfully!!!");
        },
        onSettled: () => {
          setAdding(false);
        },
      }
    );
  };
  const buyNowHandler = () => {
    // First check if user is logged in
    if (!userData?.id) {
      toast.dismiss();
      toast.info("Please login to Buy Now this Product");
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    if (isOutOfStock) {
      toast.dismiss();
      toast.error("Selected variant is out of stock");
      return;
    }

    setAdding(true);
    addToCart(
      {
        user: userData.id,
        product: product?.id,
        qty: quantity,
        flavour: isCombo ? "Combo" : selectedFlavour,
        varientId: isCombo ? 0 : selectedVarientId,
        isCombo,
      },
      {
        onSuccess: () => {
          router.push("/cart");
        },
        onSettled: () => {
          setAdding(false);
        },
      }
    );
  };
  return (
    <div>
      <p
        onClick={() => {
          if (product?.brandId) {
            sessionStorage.removeItem("selectedCategoryId");
            sessionStorage.removeItem("selectedCategoryName");
            sessionStorage.removeItem("selectedSubcategoryId");
            sessionStorage.removeItem("selectedSubcategoryName");

            dispatch({
              type: "SET_SELECTED_BRANDS",
              payload: `brands[]=${product.brandId}`,
            });
            router.push("/shop-by-brands");
          }
        }}
        className="text-green-700 text-xl not-italic font-normal cursor-pointer hover:text-primary transition-colors "
      >
        {product?.brandName}
      </p>
      <h2 className="text-black text-2xl not-italic font-semibold ">
        {product?.name}
      </h2>
      <ProductRating
        productId={product?.id}
        userId={userData?.id || 1}
        rating={product?.totalRating}
        avgRating={product?.averageRating}
        isCombo={isCombo}
      />
      <div className="flex items-center justify-between">
        <PriceCard varient={selectedVariantPricing as Varient} className="mb-3" />
        <OutlinedButton
          label="+ Compare"
          className="hidden max-[890px]:block"
          onClick={() => {
            router.push(`/comparison?productId=${product?.id}`);
          }}
        />
      </div>
      <div className="max-[450px]:hidden">
        <QuantityCard
          maxQuantity={maxQuantity}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
      <div className="flex gap-3 whitespace-nowrap mt-6 w-[85%] max-lg:flex-col lg:justify-between max-[1220px]:w-full max-[450px]:hidden">
        <OutlinedButton
          disable={adding || isOutOfStock}
          loading={adding}
          onClick={addCartHandler}
          label={isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          className="flex-1"
        />
        <PrimaryButton
          disable={adding || isOutOfStock}
          loading={adding}
          onClick={buyNowHandler}
          label={isOutOfStock ? "OUT OF STOCK" : "BUY NOW"}
          className="flex-1"
        />
      </div>
    </div>
  );
}

const ProductRating = ({
  rating,
  avgRating,
  productId,
  userId,
  isCombo = false,
}: {
  rating: number;
  avgRating: number;
  userId: number;
  productId: number;
  isCombo?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { userData } = useAppContext();
  const { data, dataUpdatedAt } = useGEtWishList(Number(userData?.id));
  const { mutate: addToWishList } = useAddToWishList();
  const { mutate: removeFromWishList } = useRemoveFormWishList();
  const [isWishListed, setIsWishListed] = useState<boolean>(false);

  useEffect(() => {
    const prod = data?.filteredList?.find(
      (pro: any) =>
        pro.id === productId && Boolean(pro.isCombo) === Boolean(isCombo)
    );
    setIsWishListed(Boolean(prod));
  }, [dataUpdatedAt, data, productId, isCombo]);

  const addToWishlist = (e: any) => {
    e.stopPropagation();
    setIsWishListed(true);
    addToWishList(
      { productId: productId as number, userId: userData?.id as number, isCombo: isCombo },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-Products"] });
          queryClient.invalidateQueries({ queryKey: ["wishlist"] });
          toast.success("Product added to wishlist Successfully!!!");
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
      { productId: productId as number, userId: userData?.id as number, isCombo },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-Products"] });
          queryClient.invalidateQueries({ queryKey: ["wishlist"] });
          toast.success("Product removed from wishlist Successfully!!!");
        },
        onError: () => {
          setIsWishListed(true);
        },
      }
    );
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {avgRating > 0 && (
          <>
            <StarIcon />
            <p className="text-black text-xl not-italic font-bold">
              {avgRating}
            </p>
            <span className="text-black text-base not-italic font-medium opacity-30">
              ({rating} Reviews)
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button>
          <ShareIcon />
        </button>
        <button className="">
          {isWishListed ? (
            <div onClick={removeWish}>{<WhishlistIcon />}</div>
          ) : (
            <div onClick={addToWishlist}>
              <WishlistIconWhite />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

const PriceCard = ({
  className,
  varient,
}: {
  className?: string;
  varient: Varient;
}) => {
  const marketPrice = getVariantMarketPrice(varient);
  const sellingPrice = getVariantSellingPrice(varient);
  const discountPercent = getVariantDiscountPercent(varient);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {discountPercent > 0 && (
          <p className="text-black text-base not-italic font-normal line-through opacity-30">
            ₹{marketPrice.toFixed(0)}/-
          </p>
        )}
        {discountPercent > 0 && (
          <p className="text-green-500 text-xs not-italic font-semibold">
            {discountPercent.toFixed(0)}% off
          </p>
        )}
      </div>
      <p className="text-gradient text-2xl not-italic font-bold">
        ₹{sellingPrice.toFixed(0)}/-
      </p>
      <p className="text-black text-xs not-italic font-normal">
        Inclusive of all taxes
      </p>
    </div>
  );
};
export const percentOffCalc = (marketPrice: number, sellingPrice: number) => {
  if (!marketPrice || marketPrice <= 0 || !sellingPrice) return "0";
  const priceDiff = marketPrice - sellingPrice;
  const percentOff = (priceDiff / marketPrice) * 100;
  return percentOff.toFixed(0);
};
export const QuantityCard = ({
  setQuantity,
  quantity,
  maxQuantity,
}: {
  setQuantity: any;
  quantity: number;
  maxQuantity: number;
}) => {
  const isOutOfStock = maxQuantity <= 0;
  const decreaseHandler = () => {
    if (isOutOfStock) return;
    setQuantity(quantity === 1 ? 1 : quantity - 1);
  };
  const increaseHandler = () => {
    if (isOutOfStock) return;
    setQuantity(quantity < maxQuantity ? quantity + 1 : quantity);
  };
  return (
    <div>
      <p className="text-black text-lg not-italic font-semibold mb-3 max-[450px]:hidden">
        Quantity:
      </p>
      <div className="flex items-center gap-5">
        <button
          onClick={decreaseHandler}
          disabled={isOutOfStock || quantity <= 1}
          className="w-[24px] h-[24px] shadow-md border text-gradient flex items-center justify-center rounded-sm bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>
        <p className="text-black text-sm not-italic font-semibold">
          {isOutOfStock ? "00" : quantity < 10 ? `0${quantity}` : quantity}
        </p>
        <button
          onClick={increaseHandler}
          disabled={isOutOfStock || quantity >= maxQuantity}
          className="w-[24px] h-[24px] shadow-md border text-gradient flex items-center justify-center rounded-sm bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
};
