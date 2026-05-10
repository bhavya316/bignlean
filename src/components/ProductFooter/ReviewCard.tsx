"use client";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { ProductDetailType } from "@/utils/productType";
import ProductReviewForm from "../Forms/ProductReviewForm/ProductReviewForm";
import ModalPopup from "../Wrappers/ModalPopup";
import CustomerReviewCard from "./CustomerReviewCard";
import SideReviewsCard from "./SideReviewsCard";

export default function ReviewCard({
  product,
}: {
  product: ProductDetailType;
}) {
  const { reviewModalToggle } = useAppContext();
  const dispatch = useDispatchContext();
  return (
    <div className="flex gap-10 max-[800px]:flex-col">
      <div className="flex-[0.35]">
        <CustomerReviewCard product={product} />
      </div>
      <div className="flex-[0.65]">
        <SideReviewsCard ratings={product?.ratings} />
      </div>
      {reviewModalToggle && (
        <ModalPopup
          onclose={() => dispatch({ type: "REVIEW_MODAL_TOGGLE_OFF" })}
        >
          <ProductReviewForm product={product} />
        </ModalPopup>
      )}
    </div>
  );
}
