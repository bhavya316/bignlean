import { TrashIcon } from "@/Icons";
import {
  useGetProductDetail,
  useRemoveFromCart,
  useUpdateQuantityFromCart,
} from "@/queries/Cart";
import { cartData } from "./CartProducts";
import {
  getFlavorLabel,
  getOptionLabel,
  getVariantMarketPrice,
  getVariantSavings,
  getVariantSellingPrice,
  resolveVariantSelection,
} from "@/utils/variantPricing";
import { getFirstMediaUrl } from "@/utils/media";

export default function CartProductCard({
  className,
  productDetail,
}: {
  className?: string;
  productDetail: cartData;
}) {
  const { mutate: removeFromCart } = useRemoveFromCart();
  const isCombo =
    Boolean((productDetail as any)?.isCombo || productDetail?.product?.isCombo) ||
    String(productDetail?.flavour || "").toLowerCase() === "combo";
  const { data } = useGetProductDetail(isCombo ? 0 : productDetail?.product?.id, 1);
  const { mutate: updateQuantityFromCart } = useUpdateQuantityFromCart();
  const comboVariant = {
    id: 0,
    mrp: String(productDetail?.mrp || productDetail?.product?.mrp || 0),
    sellingPrice: String(
      productDetail?.sellingPrice ||
        productDetail?.product?.sellingPrice ||
        productDetail?.product?.price ||
        0
    ),
    premiumPrice: String(
      productDetail?.premiumPrice ||
        productDetail?.product?.price ||
        productDetail?.product?.sellingPrice ||
        productDetail?.product?.mrp ||
        0
    ),
    units: "Combo",
    stock: "999",
    flavor: ["Combo"],
  };
  const productData = isCombo
    ? productDetail?.product?.varients?.[0] || comboVariant
    : productDetail?.product?.varients?.find(
        (varient) => varient.id === productDetail?.varientId
      );
  const selectedFlavour = getFlavorLabel(productDetail?.flavour as any);
  const selectedVariantPricing = resolveVariantSelection(
    productData,
    selectedFlavour
  );
  const unitLabel = isCombo ? "Combo" : getOptionLabel(selectedVariantPricing?.units);
  const availableStock = isCombo ? 999 : Number(selectedVariantPricing?.stock || 0);
  const marketPrice = getVariantMarketPrice(selectedVariantPricing);
  const sellingPrice = getVariantSellingPrice(selectedVariantPricing);
  const savings = getVariantSavings(selectedVariantPricing);
  const displayProduct = isCombo ? productDetail?.product : data?.data?.result || productDetail?.product;
  const decreaseQuantity = () => {
    const nextQty = Number(productDetail?.qty || 0) - 1;
    if (nextQty <= 0) {
      removeFromCart(productDetail?.id);
      return;
    }
    updateQuantityFromCart({
      productId: productDetail?.id,
      qty: nextQty,
    });
  };

  return (
    <div
      className={`grid  items-center grid-cols-[max-content_1fr_max-content] gap-8 max-[500px]:gap-4 ${className}`}
    >
      <img
        src={getFirstMediaUrl(displayProduct?.images)}
        alt="product"
        className="h-[100px] w-[75px] max-sm:min-w-[50px] max-sm:h-[75px] object-contain bg-gray-50 rounded"
      />
      <div>
        <p className="text-black text-base not-italic font-medium max-[500px]:text-sm">
          {displayProduct?.name}
        </p>
        <p className="text-black text-xs not-italic font-normal opacity-40">
          {unitLabel} - {selectedFlavour}
        </p>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {savings > 0 && (
            <p className="text-black text-xs not-italic font-normal line-through opacity-40">
              ₹{marketPrice.toFixed(0)}
            </p>
          )}
          <p className="text-black text-sm not-italic font-bold">
            ₹{sellingPrice.toFixed(0)}
          </p>
          {savings > 0 && (
            <p className="text-green-500 text-sm not-italic font-medium">
              Save ₹{savings.toFixed(0)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            onClick={decreaseQuantity}
            className="w-[24px] sm-3 bg-white text-gradient flex items-center justify-center rounded-sm"
          >
            -
          </button>
          <p className="text-black text-sm not-italic font-semibold">
            {productDetail?.qty}
          </p>
          <button
            onClick={() =>
              updateQuantityFromCart({
                productId: productDetail?.id,
                qty: productDetail?.qty + 1,
              })
            }
            disabled={availableStock > 0 && productDetail?.qty >= availableStock}
            className="w-[24px] sm-3 bg-white text-gradient flex items-center justify-center rounded-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(productDetail?.id)}
        className="ml-auto px-5"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
