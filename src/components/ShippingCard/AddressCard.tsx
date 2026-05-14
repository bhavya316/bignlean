"use client";
import { TrashIcon } from "@/Icons";
import { useRemoveAddress } from "@/queries/Address";
import { useRouter } from "next/navigation";

export default function AddressCard({
  address,
  setAddressId,
  onAddressSelect,
  selectedAddressId,
}: {
  address: any;
  setAddressId?: any;
  onAddressSelect?: (address: any) => void;
  selectedAddressId?: number | string | null;
}) {
  const { mutate: removeAddress } = useRemoveAddress();
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white sm-3 p-2 px-3">
      <input
        onChange={() => {
          if (onAddressSelect) {
            onAddressSelect(address);
          }
          if (setAddressId) {
            setAddressId(address?.id);
          }
        }}
        type="radio"
        name="address"
        checked={Number(selectedAddressId) === Number(address?.id)}
        className="scale-150"
      />
      <div>
        <p className="text-black text-sm not-italic font-semibold leading-4 mb-2">
          {address?.type}
        </p>
        <p className="text-black text-xs not-italic font-normal leading-4 opacity-75">
          {[
            address?.flat,
            address?.landmark,
            address?.city,
            address?.state,
          ].join(",")}{" "}
          pincode:{address?.pincode}
        </p>
      </div>
      <button
        onClick={() => router.push(`/add-address?addressId=${address?.id}`)}
        className="ml-auto"
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.5643 2.75781C12.2414 2.08073 13.3391 2.08073 14.0162 2.75781L15.2422 3.98378C15.9193 4.66087 15.9193 5.75864 15.2422 6.43572L14.1552 7.52271C14.0699 7.48045 13.9801 7.43476 13.887 7.38575C13.2604 7.05589 12.5169 6.59293 11.962 6.03802C11.4071 5.48312 10.9441 4.73959 10.6143 4.11302C10.5653 4.01992 10.5196 3.93013 10.4773 3.84479L11.5643 2.75781ZM11.1665 6.83352C11.8232 7.49015 12.6582 8.00696 13.3196 8.35831L9.04503 12.6329C8.77977 12.8981 8.43562 13.0702 8.06425 13.1233L5.48972 13.4911C4.9176 13.5728 4.42721 13.0824 4.50894 12.5103L4.87673 9.93575C4.92979 9.56438 5.10186 9.22023 5.36712 8.95497L9.6417 4.68039C9.99305 5.34176 10.5099 6.17686 11.1665 6.83352ZM2.8125 14.625C2.50184 14.625 2.25 14.8768 2.25 15.1875C2.25 15.4982 2.50184 15.75 2.8125 15.75H15.1875C15.4982 15.75 15.75 15.4982 15.75 15.1875C15.75 14.8768 15.4982 14.625 15.1875 14.625H2.8125Z"
            fill="#28303F"
          />
        </svg>
      </button>
      <button onClick={() => removeAddress(address?.id)}>
        <TrashIcon />
      </button>
    </div>
  );
}
