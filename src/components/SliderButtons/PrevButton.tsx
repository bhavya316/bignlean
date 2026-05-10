"use client";
import { useSwiper } from "swiper/react";

export default function PrevButton({
  height,
  width,
}: {
  height?: string;
  width?: string;
}) {
  const swiper = useSwiper();
  return (
    <button
      style={{ width, height }}
      className="prev-btn w-[50px] h-[50px] max-[700px]:w-[30px] max-[700px]:h-[30px] absolute top-[50%] left-4 translate-y-[-50%] z-10 rotate-180 cursor-pointer"
      onClick={() => swiper.slidePrev()}
    ></button>
  );
}
