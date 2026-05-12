"use client";
import { Products } from "@/components/shop-by-brands/ShopByBrands";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useGetOfferProducts } from "@/queries/dataHandlers";
import { getMediaUrl } from "@/utils/media";
import { useParams } from "next/navigation";

type Props = {};

export default function page({}: Props) {
  const params = useParams();
  const id = params?.id as string;
  const { data } = useGetOfferProducts(Number(id));
  return (
    <CustomPageWrapper className="flex flex-col items-center gap-10">
      <div className="w-full max-w-[1200px] overflow-hidden rounded-lg bg-gray-100 shadow-sm">
        <img
          src={getMediaUrl(data?.offer?.image, "/assets/product.png")}
          alt={data?.offer?.name || "offer"}
          className="h-[260px] w-full object-cover object-center max-[640px]:h-[190px]"
        />
      </div>
      <Products isOffer={true} products={data?.offer?.products} />
    </CustomPageWrapper>
  );
}
