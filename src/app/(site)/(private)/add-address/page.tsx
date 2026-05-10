import AddAddressForm from "@/components/Forms/AddAddressForm/AddAddressForm";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";

export default function page({
  searchParams,
}: {
  searchParams: { addressId: string };
}) {
  return (
    <CustomPageWrapper heading="Add Address">
      <div className="flex gap-[70px] w-[1000px] max-[1000px]:w-full mx-auto max-[1050px]:gap-[10px] max-[800px]:flex-col">
        <div className="flex-[0.5] max-[800px]:hidden">
          <img src={"assets/map/map.png"} alt="map" className="w-full h-full" />
        </div>
        <div className="flex-[0.5]">
          <AddAddressForm addressId={searchParams?.addressId} />
        </div>
      </div>
    </CustomPageWrapper>
  );
}
