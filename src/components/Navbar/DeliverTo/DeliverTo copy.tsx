import { DeliverToIcon } from "@/Icons";
import { useGetUserLocation } from "@/queries/dataHandlers";
import { useEffect, useState } from "react";

export default function DeliverTo() {
  const [cordinates, setCordinates] = useState<any>(null);
  const { data } = useGetUserLocation(cordinates);
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
        Deliver to -
        <span className="font-semibold uppercase">
          {data?.address?.city}-{data?.address?.postcode}
        </span>
      </p>
    </div>
  );
}
