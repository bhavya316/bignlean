"use client";
import { useSwiper } from "swiper/react";

export default function NextButton({
  height,
  width,
}: {
  width?: string;
  height?: string;
}) {
  const swiper = useSwiper();
  return (
    <button
      style={{ width, height }}
      className="next-btn w-[50px] h-[50px] max-[700px]:w-[30px] max-[700px]:h-[30px] absolute top-[50%] right-4 translate-y-[-50%] z-10 "
      onClick={() => swiper.slideNext()}
    ></button>
  );
}
