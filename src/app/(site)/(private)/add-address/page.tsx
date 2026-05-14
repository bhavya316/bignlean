import AddAddressForm from "@/components/Forms/AddAddressForm/AddAddressForm";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";

export default function page({
  searchParams,
}: {
  searchParams: { addressId: string };
}) {
  const isEditing = Boolean(searchParams?.addressId);

  return (
    <CustomPageWrapper heading={isEditing ? "Edit Address" : "Add Address"}>
      <div className="w-[760px] max-[820px]:w-full mx-auto">
        <AddAddressForm addressId={searchParams?.addressId} />
      </div>
    </CustomPageWrapper>
  );
}
