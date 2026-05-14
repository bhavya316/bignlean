"use client";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import InputField from "@/components/FormComponents/InputField";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import {
  useAddAddress,
  useGetAllAddresses,
  useUpdateAddress,
} from "@/queries/Address";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const capitalizeFirstLetter = (value: string) => {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
};

const formatTextValue = (value: string) => capitalizeFirstLetter(value.trim());

export default function AddAddressForm({ addressId }: { addressId?: string }) {
  const router = useRouter();
  const { userData } = useAppContext();
  const { mutate: addAddress } = useAddAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    pincode: "",
    flat: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    state: "",
    type: "home",
  });
  const { data } = useGetAllAddresses(userData?.id as number);

  useEffect(() => {
    if (!addressId || !data?.data?.addresses) {
      return;
    }

    const address = data.data.addresses.find(
      (address: any) => address?.id === Number(addressId)
    );

    if (!address) {
      return;
    }

    const addressLines = splitAddressLines(address?.landmark);

    setFormData({
      name: capitalizeFirstLetter(address?.name || ""),
      phone: address?.phone || "",
      pincode: address?.pincode || "",
      flat: capitalizeFirstLetter(address?.flat || ""),
      addressLine1: capitalizeFirstLetter(addressLines[0] || ""),
      addressLine2: capitalizeFirstLetter(addressLines[1] || ""),
      addressLine3: capitalizeFirstLetter(addressLines.slice(2).join(", ") || ""),
      city: capitalizeFirstLetter(address?.city || ""),
      state: capitalizeFirstLetter(address?.state || ""),
      type: String(address?.type || "").toLowerCase(),
    });
  }, [addressId, data]);

  const handleTextChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: capitalizeFirstLetter(e.target.value) });
  };

  const handleNumberChange = (field: string, maxLength: number) => (e: any) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      !formData?.name &&
      !formData?.phone &&
      !formData?.pincode &&
      !formData?.addressLine1 &&
      !formData?.addressLine2 &&
      !formData?.addressLine3 &&
      !formData?.city &&
      !formData?.flat &&
      !formData?.state &&
      !formData?.type
    ) {
      return;
    }

    const landmark = [
      formData.addressLine1,
      formData.addressLine2,
      formData.addressLine3,
    ]
      .map((line) => formatTextValue(line))
      .filter(Boolean)
      .join(", ");

    const formattedFormData = {
      name: formatTextValue(formData.name),
      phone: String(formData.phone || "").trim(),
      pincode: String(formData.pincode || "").trim(),
      flat: formatTextValue(formData.flat),
      landmark,
      city: formatTextValue(formData.city),
      state: formatTextValue(formData.state),
      type: formData.type
        ? formData.type.charAt(0).toUpperCase() + formData.type.slice(1).toLowerCase()
        : formData.type,
    };

    if (addressId) {
      updateAddress(
        { formData: formattedFormData, addressId },
        {
          onSuccess: () => {
            toast.success("Address updated successfully.");
            router.push("/cart");
          },
          onError: () => {
            toast.error("Something went wrong!!!");
          },
        }
      );
    } else {
      addAddress(
        { ...formattedFormData, user: userData?.id as number },
        {
          onSuccess: () => {
            toast.success("Address added successfully.");
            router.push("/cart");
          },
          onError: () => {
            toast.error("Something went wrong!!!");
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
      <InputField
        type="text"
        label="Full name"
        placeholder="Enter full name"
        shadow={false}
        required
        onChange={handleTextChange("name")}
        value={formData?.name}
      />
      <InputField
        type="mobile"
        label="Mobile number"
        placeholder="Enter mobile number"
        shadow={false}
        required
        onChange={handleNumberChange("phone", 10)}
        value={formData?.phone}
      />
      <InputField
        type="text"
        label="Pincode"
        placeholder="Enter pincode"
        shadow={false}
        required
        onChange={handleNumberChange("pincode", 6)}
        value={formData?.pincode}
      />
      <label className="flex flex-col">
        <span className="mb-2 text-sm font-medium text-[#222]">Address type</span>
        <select
          value={formData?.type || ""}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
          className="w-full rounded-[15px] outline-none p-5 text-sm not-italic font-normal border border-[#D9D9D9] bg-white"
        >
          <option value="" disabled>
            Select address type
          </option>
          <option value="home">Home</option>
          <option value="office">Office</option>
          <option value="others">Others</option>
        </select>
      </label>
      <InputField
        type="text"
        label="Flat no. / House no."
        placeholder="Flat no., house no., building"
        shadow={false}
        required
        onChange={handleTextChange("flat")}
        value={formData?.flat}
      />
      <InputField
        type="text"
        label="Address line 1"
        placeholder="Street, area, locality"
        shadow={false}
        required
        onChange={handleTextChange("addressLine1")}
        value={formData?.addressLine1}
      />
      <InputField
        type="text"
        label="Address line 2"
        placeholder="Nearby landmark or apartment name"
        shadow={false}
        onChange={handleTextChange("addressLine2")}
        value={formData?.addressLine2}
      />
      <InputField
        type="text"
        label="Address line 3"
        placeholder="Additional directions"
        shadow={false}
        onChange={handleTextChange("addressLine3")}
        value={formData?.addressLine3}
      />
      <InputField
        type="text"
        label="City"
        placeholder="Enter city"
        shadow={false}
        required
        onChange={handleTextChange("city")}
        value={formData?.city}
      />
      <InputField
        type="text"
        label="State"
        placeholder="Enter state"
        shadow={false}
        required
        onChange={handleTextChange("state")}
        value={formData?.state}
      />
      <div className="col-span-2 mt-2 max-[640px]:col-span-1">
        <PrimaryButton type="submit" label="Save & Proceed" />
      </div>
    </form>
  );
}

const splitAddressLines = (landmark?: string) =>
  String(landmark || "")
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean);
