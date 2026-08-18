import Image from "next/image";
import React from "react";

export default function OfferCard() {
  return (
    <div className="w-[1000px] rounded-xl overflow-hidden max-[1000px]:w-full mx-auto my-[60px] px-5">
      <Image
        src={"/assets/membership.png"}
        alt="membership"
        width={900}
        height={"100"}
        className="w-full"
      />
    </div>
  );
}
