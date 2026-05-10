import { BmcIcon, CartIcon, StarIcon } from "@/Icons";
import Image from "next/image";

export default function DownloadBanner() {
  return (
    <div className="w-[1050px] mx-auto mt-[60px] max-[1050px]:w-full relative flex justify-end bg-[#e5e7eb] rounded-xl p-9 mb-9 overflow-hidden">
      <Image
        src={"/assets/download.png"}
        alt="download"
        width={450}
        height={300}
        className="absolute top-0 left-0 bottom-0 h-full"
      />
      <div className="max-w-[550px]">
        <h2 className="text-black text-3xl not-italic font-normal">
          Download the
        </h2>
        <h3 className="text-black text-4xl not-italic font-semibold mb-11">
          Bignlean Mobile App
        </h3>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
            <CartIcon />
          </div>
          <div>
            <p className="text-black text-2xl not-italic font-semibold">
              Easier, Faster Shopping
            </p>
            <p className="text-gray-600 text-sm not-italic font-normal">
              Get Authentic Supplement, Fitness solutions, and a healthy
              lifestyle
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
            <BmcIcon />
          </div>
          <div>
            <p className="text-black text-2xl not-italic font-semibold">
              Fuel your Fitness Goals
            </p>
            <p className="text-gray-600 text-sm not-italic font-normal">
              Complete challenges to build habit & win HK cash
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-11">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
            <StarIcon />
          </div>
          <div>
            <p className="text-black text-2xl not-italic font-semibold">
              Get Exclusive App Only Benefits
            </p>
            <p className="text-gray-600 text-sm not-italic font-normal">
              Extra discounts, offers and cashbacks
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-[161px]">
            <Image
              src={"/assets/footer/googleplay.png"}
              alt="google play"
              width={161}
              height={36}
              className="w-full"
            />
          </button>
          <button className="w-[161px]">
            <Image
              src={"/assets/footer/applestore.png"}
              alt="google play"
              width={121}
              height={36}
              className="w-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
