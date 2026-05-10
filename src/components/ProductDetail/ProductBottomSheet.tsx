import { ShoppingBagIcon } from "@/Icons";
import { QuantityCard } from "./ProductInfo";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductDetailType } from "@/utils/productType";
import { useAddToCartList } from "@/queries/Cart";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { resolveVariantSelection } from "@/utils/variantPricing";

export default function ProductBottomSheet({
  product,
  selectedFlavour,
  selectedVarientId,
}: {
  product: ProductDetailType;
  selectedVarientId: number;
  selectedFlavour: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const varient = product.varients.find(
    (varient) => varient.id === selectedVarientId
  );
  const selectedVariantPricing = resolveVariantSelection(varient, selectedFlavour);
  const maxQuantity = Number(selectedVariantPricing?.stock || 0);
  const isOutOfStock = maxQuantity <= 0;
  const { userData } = useAppContext();
  const router = useRouter();

  const { mutate: addToCart, isPending } = useAddToCartList();

  useEffect(() => {
    if (maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
    if (maxQuantity <= 0 && quantity !== 1) {
      setQuantity(1);
    }
  }, [maxQuantity, quantity]);

  const buyNowHandler = () => {
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

    addToCart(
      {
        user: userData.id,
        product: product?.id,
        qty: quantity,
        flavour: selectedFlavour,
        varientId: selectedVarientId,
      },
      {
        onSuccess: () => {
          router.push("/cart");
        },
      }
    );
  };

  return (
    <div className="hidden max-[450px]:flex fixed bottom-[5%] left-0 z-[9999] max-sm:border-t flex-col w-full px-2 pt-3 pb-10  gap-3 bg-white">
      {/* <p className="text-black text-base not-italic font-normal">
        <span className="text-black text-base not-italic font-bold">
          Variant:
        </span>{" "}
        {product?.weight > 15 ? `${product?.weight}g` : `${product?.weight}kg`}{" "}
        {product?.flavor}
      </p> */}
      <div className="flex items-center justify-between">
        <QuantityCard
          maxQuantity={maxQuantity}
          quantity={quantity}
          setQuantity={setQuantity}
        />
        <p className="text-black text-base not-italic font-bold">
          <span className="text-black text-sm not-italic font-medium">
            Total:
          </span>{" "}
          ₹{(
            Number(selectedVariantPricing?.sellingPrice || 0) * quantity
          ).toFixed(0)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link href={"/cart"} className="border border-red-500 p-2 rounded-md">
          <ShoppingBagIcon />
        </Link>
        <div className="flex-1 grow">
          <PrimaryButton
            disable={isPending || isOutOfStock}
            loading={isPending}
            onClick={buyNowHandler}
            label={isOutOfStock ? "OUT OF STOCK" : "BUY NOW"}
            className="flex-1 w-full"
          />{" "}
        </div>
      </div>
    </div>
  );
}
