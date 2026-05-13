"use client";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useGetAllOffers } from "@/queries/dataHandlers";
import { getMediaUrl } from "@/utils/media";
import Link from "next/link";

export default function OffersPage() {
  const { data, isLoading } = useGetAllOffers();
  const offers = data?.offers || [];

  return (
    <CustomPageWrapper heading="Offer Zone" className="flex flex-col gap-6">
      {isLoading ? (
        <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-[260px] animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : offers.length > 0 ? (
        <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          {offers.map((offer: any) => (
            <Link
              href={`/offers/${offer.id}`}
              key={offer.id}
              className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[16/9] overflow-hidden bg-white p-4">
                <img
                  src={getMediaUrl(offer.image, "/assets/product.png")}
                  alt={offer.name}
                  className="h-full w-full object-contain object-center transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-lg font-semibold text-black">
                    {offer.name}
                  </p>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#E70F0F]">
                    {offer.products?.length || 0} items
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Explore bundled savings and limited-time product deals.
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-10 text-center text-gray-500 shadow-sm">
          No offers available right now.
        </div>
      )}
    </CustomPageWrapper>
  );
}
