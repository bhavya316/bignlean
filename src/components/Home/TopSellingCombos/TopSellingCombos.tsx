import { SectionHeader } from "@/components";

export default function TopSellingCombos() {
  return (
    <div className="w-[1200px] mx-auto mt-8 lg:mt-[60px] max-[1200px]:w-full flex flex-col gap-6 lg:gap-[40px]  overflow-hidden px-5">
      <SectionHeader label="Top Selling Combos" />
      <div className="flex items-center gap-6 max-[700px]:flex-col">
        <div className="flex items-center gap-6">
          <div>
            <img
              src={"/assets/budget/img1.png"}
              className="w-full"
              alt="offer"
            />
          </div>
          <div>
            <img
              src={"/assets/budget/img2.png"}
              className="w-full"
              alt="offer"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <img
              src={"/assets/budget/img3.png"}
              className="w-full"
              alt="offer"
            />
          </div>
          <div>
            <img
              src={"/assets/budget/img1.png"}
              className="w-full"
              alt="offer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
