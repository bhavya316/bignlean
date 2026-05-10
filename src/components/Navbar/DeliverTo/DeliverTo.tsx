import { DeliverToIcon } from "@/Icons";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetAllAddresses } from "@/queries/Address";
import { useGetUserLocation } from "@/queries/dataHandlers";
import { useEffect, useState } from "react";

export default function DeliverTo() {
  const { userData } = useAppContext();
  const [cordinates, setCordinates] = useState<any>(null);
  const { data: geoLocation } = useGetUserLocation(cordinates);
  const { data: addressData } = useGetAllAddresses(userData?.id as number);
  const savedAddresses = addressData?.data?.addresses || [];
  const savedAddress =
    savedAddresses.find((address: any) => address?.isDefault) ||
    savedAddresses[0];
  const locationLabel = savedAddress
    ? `${savedAddress?.city || "Address"}-${savedAddress?.pincode || ""}`
    : geoLocation?.address?.city
    ? `${geoLocation.address.city}-${geoLocation.address.postcode || ""}`
    : "your location";

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    function success(pos: any) {
      const crd = pos.coords;
      setCordinates({ lat: crd.latitude, lang: crd.longitude });
    }
    function error(err: any) {}
    navigator?.geolocation.getCurrentPosition(success, error, options);
  }, []);
  return (
    <div className="flex items-center gap-2">
      <DeliverToIcon />
      <p className="text-black text-xs not-italic font-medium whitespace-nowrap">
        Deliver to{" "}
        <span className="font-semibold uppercase">
          {locationLabel}
        </span>
      </p>
    </div>
  );
}
