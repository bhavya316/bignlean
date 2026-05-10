import { TrashIcon } from "@/Icons";
import PrimaryButton from "../Buttons/PrimaryButton";
import { ProductDataType } from "@/utils/Types";
import { useAddToCartList } from "@/queries/Cart";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function SuggestedProductCard({
  product,
  className,
}: {
  className?: string;
  product: ProductDataType;
}) {
  const { userData } = useAppContext();
  const { mutate: addToCart, isPending } = useAddToCartList();
  const queryClient = useQueryClient();
  const varient = product?.varients[0];
  return (
    <div className={`flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${className}`}>
      <img
        src={product?.images?.[0] || "/placeholder-product.png"}
        alt={product?.name || "product"}
        className="w-[100px] h-[100px] object-contain bg-gray-50 rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-black line-clamp-2 text-sm not-italic font-semibold mb-1 overflow-hidden">
          {product?.name || product?.brand?.heading || product?.brand?.body || 'Product'}
        </p>
        <p className="text-gray-600 text-xs not-italic font-normal mb-2">
          {varient?.units} - {Array.isArray(varient?.flavor) ? varient?.flavor[0] : varient?.flavor}
        </p>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <p className="text-gray-500 text-xs not-italic font-normal line-through">
            ₹{Number(varient?.premiumPrice || 0).toFixed(0)}
          </p>
          <p className="text-black text-sm not-italic font-bold">
            ₹{Number(varient?.sellingPrice || 0).toFixed(0)}
          </p>
          {(() => {
            const premiumPrice = Number(varient?.premiumPrice || 0);
            const sellingPrice = Number(varient?.sellingPrice || 0);
            const savings = premiumPrice - sellingPrice;

            return savings > 0 ? (
              <p className="text-green-600 text-xs not-italic font-medium bg-green-50 px-1 py-0.5 rounded">
                Save ₹{savings.toFixed(0)}
              </p>
            ) : null;
          })()}
        </div>
        <PrimaryButton
          className="w-auto py-0 px-0 text-xs font-medium rounded hover:bg-red-600 transition-colors"
          loading={isPending}
          onClick={() =>
            addToCart(
              {
                user: userData?.id as number,
                product: product?.id,
                qty: 1,
                flavour: Array.isArray(product?.varients?.[0]?.flavor)
                  ? product?.varients?.[0]?.flavor?.[0]
                  : product?.varients?.[0]?.flavor,
                varientId: product?.varients?.[0]?.id,
              },
              {
                onSuccess: (data) => {
                  queryClient.invalidateQueries({ queryKey: ["cart"] });
                  toast.success("Product added to cart!");
                },
                onError: (error) => {
                  toast.error("Failed to add product. Please try again.");
                  console.error("Add to cart error:", error);
                },
              }
            )
          }
          label="+ Add"
        />
      </div>
    </div>
  );
}
