import Image from "next/image";
import PrimaryButton from "../Buttons/PrimaryButton";

export default function Subscribe() {
  return (
    <div className="rounded-lg bg-gray-100 py-3 px-5">
      <h3 className="text-blue-900 text-base not-italic font-normal leading-6 mb-3">
        Subscribe
      </h3>

      <form className="flex bg-white overflow-hidden rounded-[15px] ">
        <input
          type="email"
          className="outline-none px-5 flex-[0.7] rounded-l-[15px] border border-gray-400"
          placeholder="Enter your email"
        />
        <PrimaryButton
          label=">"
          className="rounded-l-none rounded-r-[15px] flex-[0.3] px-[20px]"
        />
      </form>

      <p className="mb-5 mt-1 text-black text-xs not-italic font-normal leading-6">
        <span className="text-red-500">*</span>Get newsletters and exclusive
        offers
      </p>

      <div className="flex justify-between">
        <Image
          src={"/assets/footer/sub1.png"}
          alt="footer"
          width={68}
          height={60}
        />
        <Image
          src={"/assets/footer/sub2.png"}
          alt="footer"
          width={65}
          height={60}
        />
        <Image
          src={"/assets/footer/sub3.png"}
          alt="footer"
          width={69}
          height={62}
        />
      </div>
    </div>
  );
}
