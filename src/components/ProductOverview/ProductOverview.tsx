"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OutlinedButton } from "..";

const VegIcon = (  ) => (
  <svg
       width={15} height={15} fill="#00A000"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>Vegetarian Food Icon</title>
        <path d="M12 2C9.243 2 7 4.243 7 7c0 3.333 3 7 5 9 2-2 5-5.667 5-9 0-2.757-2.243-5-5-5zm0 11.5c-1.127 0-2-.873-2-2h4c0 1.127-.873 2-2 2zm0-11.5C7.373 2 3 6.373 3 11.5S7.373 21 12 21s9-4.373 9-9.5S16.627 2 12 2z" />
    </svg>
);
// const NonVegIcon = (  ) => (
//   <svg
//        width={15} height={15} fill="#FF0000"
//         viewBox="0 0 24 24"
//         xmlns="http://www.w3.org/2000/svg"
//     >
//         <title>Vegetarian Food Icon</title>
//         <path d="M12 2C9.243 2 7 4.243 7 7c0 3.333 3 7 5 9 2-2 5-5.667 5-9 0-2.757-2.243-5-5-5zm0 11.5c-1.127 0-2-.873-2-2h4c0 1.127-.873 2-2 2zm0-11.5C7.373 2 3 6.373 3 11.5S7.373 21 12 21s9-4.373 9-9.5S16.627 2 12 2z" />
//     </svg>
// );

const ImageViewer = ({ images }: any) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);

  return (
    <div className="flex  justify-between w-full gap-2 max-lg:flex-col-reverse">
      <div className="flex flex-col max-lg:flex-row pt-2 max-sm:px-2 items-center gap-2 max-h-[475px] max-lg:max-h-fit overflow-auto w-[20%] max-lg:w-full ">
      
        {images?.map((image: string, index: number) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedImage(image)}
            className={`cursor-pointer w-20 h-20 max-sm:mb-1 aspect-square rounded-xl object-contain ${
              image === selectedImage ? "ring-1 ring-black ring-offset-2 " : ""
            }`}
          />
        ))}
      </div>
      <div className="w-[80%] max-lg:w-full max-lg:shadow-none max-h-[475px] max-lg:max-h-[350px] shadow-md border rounded-xl overflow-hidden pointer-events-none relative ">
           <div className="pointer-events-none absolute top-4 right-4 z-10 flex gap-2">
           <div className="border-1.5  h-fit border-[#00A000] ">
           <VegIcon />
           {/* <NonVegIcon /> */}
          </div>
          {/* <div className="border-1.5  h-fit border-[#FF0000] ">
           <NonVegIcon />
          </div> */}
         </div>
        <img
          src={selectedImage}
          alt="Selected"
          className="w-full h-full object-contain "
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
          <div className="flex gap-2 items-center text-black text-sm not-italic font-normal">
            <div>
              <svg
                width="13"
                height="10"
                viewBox="0 0 13 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5L4.5 8.5L11.5 1"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Helps in Muscle Building
          </div>
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
