"use client";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import Accordian from "./Accordian";

const accordianData: {
  heading: string;
  srcs: string[];
  defaultToggleValue?: boolean;
}[] = [
  {
    defaultToggleValue: true,
    heading: "Bright Commodties(Glanbia Performance Nutrition)",
    srcs: ["/assets/certi/img1.png", "/assets/certi/img1.png"],
  },
  {
    heading: "GMC - Shri Balaji Overseas",
    srcs: ["/assets/certi/img1.png", "/assets/certi/img1.png"],
  },
  {
    heading: "Muscleblaze",
    srcs: ["/assets/certi/img1.png", "/assets/certi/img1.png"],
  },
  {
    heading: "Proline Nutrition (Evogen)",
    srcs: ["/assets/certi/img1.png", "/assets/certi/img1.png"],
  },
];

export default function page() {
  return (
    <CustomPageWrapper heading="App Certificates">
      <div className="w-[750px] mx-auto max-[750px]:w-full flex flex-col gap-4">
        {accordianData.map((accordian, index) => (
          <Accordian
            key={index}
            heading={accordian?.heading}
            srcs={accordian?.srcs}
            defaultToggleValue={accordian?.defaultToggleValue}
          />
        ))}
      </div>
    </CustomPageWrapper>
  );
}
