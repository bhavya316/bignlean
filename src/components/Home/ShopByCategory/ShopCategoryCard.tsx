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
      sessionStorage.setItem("selectedCategoryId", String(id));
      sessionStorage.setItem("selectedCategoryName", label || "");
      sessionStorage.removeItem("selectedSubcategoryId");
      sessionStorage.removeItem("selectedSubcategoryName");
      sessionStorage.removeItem("selectedSubcategory2Id");
      sessionStorage.removeItem("selectedSubcategory2Name");
    }
    router.push(`/category/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="h-full w-full aspect-square flex items-center justify-center p-3 rounded-xl bg-gray-200 cursor-pointer"
    >
      <img
        src={getMediaUrl(image, "/assets/logo.png")}
        alt="category"
        className="w-full h-full object-contain mix-blend-multiply"
      />
    </div>
  );
}
