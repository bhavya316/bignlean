"use client";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMediaUrl } from "@/utils/media";

type Props = {
  brandData: any;
  onClick?: () => void;
};

export default function BrandCard({ brandData, onClick }: Props) {
  const router = useRouter();
  const dispatch = useDispatchContext();

  const handleBrandClick = () => {
    onClick?.();
    if (brandData?.name) {
      dispatch({
        type: "SET_SELECTED_BRANDS",
        payload: `brands[]=${brandData?.id}`,
      });
      router.push(`/shop-by-brands?brands[]=${brandData?.id}`);
    }
  };

  return (
    <div
      onClick={handleBrandClick}
      className="h-full w-full  aspect-square flex items-center justify-center p-3 rounded-xl bg-gray-200 cursor-pointer"
    >
      <Image
        src={getMediaUrl(brandData?.image || brandData?.logo, "/assets/logo.png")}
        alt={brandData?.name || "Brand"}
        width={200}
        height={200}
        className="w-full h-full object-contain mix-blend-multiply"
        unoptimized={true}
      />
    </div>
  );
}
