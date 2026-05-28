"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OutlinedButton } from "..";
import { getMediaUrl } from "@/utils/media";

const ImageViewer = ({ images }: any) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);

  return (
    <div className="flex  justify-between w-full gap-2 max-lg:flex-col-reverse">
      <div className="flex flex-col max-lg:flex-row pt-2 max-sm:px-2 items-center gap-2 max-h-[475px] max-lg:max-h-fit overflow-auto w-[20%] max-lg:w-full ">
      
        {images?.map((image: string, index: number) => (
          <img
            key={index}
            src={getMediaUrl(image)}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedImage(image)}
            className={`cursor-pointer w-20 h-20 max-sm:mb-1 aspect-square object-contain mix-blend-multiply ${
              image === selectedImage ? "ring-1 ring-black " : ""
            }`}
          />
        ))}
      </div>
      <div className="w-[80%] max-lg:w-full max-h-[475px] max-lg:max-h-[350px] pointer-events-none relative ">
        <img
          src={getMediaUrl(selectedImage)}
          alt="Selected"
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
    </div>
  );
};

export default function ProductOverview({
  images,
  information,
  id,
}: {
  images: string[];
  information: any[];
  id: number;
}) {
  return (
    <div className="flex flex-col  gap-10 items-end max-lg:gap-5">
      {images && <ImageViewer images={images} />}
      <div className="w-full max-lg:hidden">
        <ProductBenefits id={id} information={information} />
      </div>
    </div>
  );
}

export const ProductBenefits = ({
  information,
  id,
}: {
  information: any[];
  id: number;
}) => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="border w-full shadow-sm border-gray-300 bg-white rounded-lg overflow-hidden">
        <div className="p-3 ">
          <h2 className="text-black text-sm not-italic font-bold mb-3">
            Product Benefits
          </h2>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
          className="bg-[#f7f7f7] p-[20px] gap-5"
        >
          {information?.map((info, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <p className="text-black text-xs not-italic font-normal">
                {info.nutrients}
              </p>
              <p className="text-black text-lg not-italic font-semibold">
                {info.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <OutlinedButton
        label="+ Compare"
        className="w-full"
        onClick={() => {
          router.push(`/comparison?productId=${id}`);
        }}
      />
    </div>
  );
};
