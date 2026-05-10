"use client";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  brandData: any;
  onClick?: () => void;
};

export default function BrandCard({ brandData, onClick }: Props) {
  const router = useRouter();
  const dispatch = useDispatchContext();

  const handleBrandClick = () => {
    if (brandData?.name) {
      dispatch({
        type: "SET_SELECTED_BRANDS",
        payload: `brands[]=${brandData?.id}`,
      });
      router.push("/shop-by-brands");
    }
  };

  return (
    <div
      onClick={handleBrandClick}
      className="h-full w-full  aspect-square flex items-center justify-center p-3 rounded-xl bg-gray-200 cursor-pointer"
    >
      <Image
        src={brandData?.image || "/placeholder-image.png"}
        alt={brandData?.name || "Brand"}
        width={200}
        height={200}
        className="w-full h-full object-contain mix-blend-multiply"
        unoptimized={true}
      />
    </div>
  );
}
