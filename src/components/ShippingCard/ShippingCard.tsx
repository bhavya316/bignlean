"use client";
import { useGetAllAddresses } from "@/queries/Address";
import PrimaryButton from "../Buttons/PrimaryButton";
import AddressCard from "./AddressCard";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";

export default function ShippingCard({
  setAddressId,
  err,
  onAddressSelect,
}: {
  setAddressId?: any;
  err: boolean;
  onAddressSelect?: (address: any) => void;
}) {
  const { userData } = useAppContext();
  const { data } = useGetAllAddresses(userData?.id as number);
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg sm-1 p-4 flex flex-col gap-3">
      <p className="text-black text-base flex justify-between items-center not-italic font-semibold leading-4 ">
        Shipping to{" "}
        <span className="text-red-600">{err && "Select a Address"}</span>
      </p>
      <div className="flex flex-col gap-3">
        {data?.data?.addresses?.length > 0 ? (
          data?.data?.addresses?.map((address: any) => (
            <AddressCard
              setAddressId={setAddressId}
              onAddressSelect={onAddressSelect}
              key={address?.id}
              address={address}
            />
          ))
        ) : (
          <span>No address found!!!</span>
        )}
      </div>
      <PrimaryButton
        onClick={() => router.push("/add-address")}
        label="+ Add Address"
      />
    </div>
  );
}
