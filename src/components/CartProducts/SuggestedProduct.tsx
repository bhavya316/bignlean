import { ProductDataType } from "@/utils/Types";
import SuggestedProductCard from "./SuggestedProductCard";

export default function SuggestedProduct({
  similarProducts,
}: {
  similarProducts: ProductDataType[];
}) {
  return (
    <div className=" flex flex-col mt-20  rounded-2xl gap-6">
      <h2 className="text-black text-xl not-italic font-semibold">
        Suggested Products
      </h2>
      <div className="custom-grid4 gap-3">
        {similarProducts?.map((product) => (
          <SuggestedProductCard
            key={product.id}
            product={product}
            className="bg-white"
          />
        ))}
      </div>
    </div>
  );
}
