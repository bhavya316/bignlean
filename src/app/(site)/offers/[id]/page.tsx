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
  const offer = data?.offer;
  const bannerImage = getMediaUrl(
    offer?.banner || offer?.image,
    "/assets/product.png"
  );

  return (
    <CustomPageWrapper className="flex flex-col gap-10">
      <div className="w-full overflow-hidden rounded-lg bg-white shadow-sm">
        <img
          src={bannerImage}
          alt={offer?.name || "offer"}
          className="aspect-[16/6] max-h-[420px] min-h-[150px] w-full bg-gray-100 object-contain object-center max-[640px]:aspect-[16/9]"
        />
      </div>
      <Products isOffer={true} products={offer?.products} />
    </CustomPageWrapper>
  );
}
