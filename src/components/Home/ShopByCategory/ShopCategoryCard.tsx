"use client";
import { useRouter } from "next/navigation";
import { getMediaUrl } from "@/utils/media";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
type Props = {
  image?: string;
  label: string;
  id: number;
};
export default function ShopCategoryCard({ image, label, id }: Props) {
  const router = useRouter();
  const dispatch = useDispatchContext();

  const handleClick = () => {
    dispatch({ type: "SET_SELECTED_BRANDS", payload: null });
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selectedSubcategoryId");
      sessionStorage.removeItem("selectedSubcategoryName");
      sessionStorage.removeItem("selectedSubcategory2Id");
      sessionStorage.removeItem("selectedSubcategory2Name");
    }
    router.push(`/shop-by-brands?category=${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center rounded-xl bg-gray-200 p-4 cursor-pointer h-full"
    >
      <p className="text-black text-center text-sm not-italic font-bold leading-tight mb-3 px-2 min-h-[40px] flex items-center">
        {label}
      </p>
      <img
        src={getMediaUrl(image, "/assets/product.png")}
        alt="category"
        className="aspect-video h-[100px] w-[170px] object-contain mix-blend-multiply"
      />
    </div>
  );
}
