import { useGEtCouponsList } from "@/queries/Product";
import { useState } from "react";
import { OutlinedButton } from "..";
import { toast } from "react-toastify";

export default function ProductCouponOffers() {
  const { data } = useGEtCouponsList();
  if (data?.data?.coupons?.length === 0) return null;
  return (
    <div className="w-[85%] max-lg:w-full flex flex-col gap-4 max-[450px]:w-full">
      <h2 className="text-black text-lg not-italic font-semibold mb-4">
        Coupons & offers
      </h2>
      {data?.data?.coupons.map((coupon: any) => (
        <CouponCard
          code={coupon?.coupon}
          discount={coupon?.discount}
          key={coupon?.id}
          src="/assets/product/offer1.png"
        />
      ))}
    </div>
  );
}

const CouponCard = ({
  src,
  code,
  discount,
}: {
  src: string;
  discount: number;
  code: string;
}) => {
  return (
    <div className="flex  items-center justify-between  gap-3 p-4 border-red-400 border-dashed border-[2px] rounded-xl">
      <div className="flex items-center gap-2">
        <img src={src} alt="coupon" className="w-[28px]" />
        <p className="text-black text-sm not-italic font-normal leading-4">
          use code "{code}" to get {discount} discount
        </p>
      </div>
      <OutlinedButton
        onClick={() => {
          navigator?.clipboard.writeText(code as string);
          toast.success("Coupon code copied");
        }}
        label={"Copy Code"}
        className={`!px-2 !py-1 whitespace-nowrap text-xs not-italic font-normal leading-4 !text-black cursor-pointer`}
      />
    </div>
  );
};
