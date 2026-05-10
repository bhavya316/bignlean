"use client";
import { ProductDataType } from "@/utils/Types";
import CartProductCard from "./CartProductCard";

export default function CartProducts({ data }: { data: any }) {
  return (
    <div className="sm-1 flex flex-col p-6 rounded-2xl bg-white gap-6">
      {data?.length > 0 &&
        data?.map((cart: cartData) => (
          <CartProductCard productDetail={cart} key={cart?.id} />
        ))}
    </div>
  );
}

export type cartData = {
  id: number;
  user: number;

  varientId: number;
  flavour: string;
  qty: number;
  mrp: number;
  product: ProductDataType;
  sellingPrice: number;
  premiumPrice: number;
  createdAt: string;
  updatedAt: string;
};
