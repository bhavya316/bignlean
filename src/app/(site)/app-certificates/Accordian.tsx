"use client";

import { useState } from "react";

type Props = {
  heading: string;
  srcs?: string[];
  defaultToggleValue?: boolean;
  para?: string;
};

export default function Accordian({
  defaultToggleValue,
  heading,
  srcs,
  para,
}: Props) {
  const [toggle, setToggle] = useState(defaultToggleValue || false);
  return (
    <div className="sm-3 bg-white rounded-[15px] p-4 flex flex-col gap-[24px]">
      <div
        onClick={() => setToggle(!toggle)}
        className="flex items-center justify-between cursor-pointer"
      >
        <h2>{heading}</h2>
        {toggle ? <MinusIcon /> : <PlusIcon />}
      </div>
      {toggle && (
        <div className={`flex items-center w-[${para ? "100" : "80"}%] gap-3`}>
          {para && (
            <p className="text-gray-600 text-sm not-italic leading-5 font-normal">
              {para}
            </p>
          )}
          <div className="custom-grid4">
            {srcs &&
              srcs!.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="certificates"
                  className="w-full h-auto"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MinusIcon = () => {
  return (
    <svg
      width="10"
      height="4"
      viewBox="0 0 10 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.956 0.979999V3.092H0.914V0.979999H9.956Z"
        fill="url(#paint0_linear_606_6275)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_606_6275"
          x1="-1"
          y1="2.5"
          x2="12"
          y2="2.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E70F0F" />
          <stop offset="1" stopColor="#FF5F5F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const PlusIcon = () => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.464 7.114H7.02V11.668H4.688V7.114H0.244V5.002H4.688V0.447999H7.02V5.002H11.464V7.114Z"
        fill="url(#paint0_linear_606_6288)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_606_6288"
          x1="-2"
          y1="6.5"
          x2="14"
          y2="6.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E70F0F" />
          <stop offset="1" stopColor="#FF5F5F" />
        </linearGradient>
      </defs>
    </svg>
  );
};
