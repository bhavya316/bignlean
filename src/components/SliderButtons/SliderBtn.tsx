"use client";
import { useSwiper } from "swiper/react";

export default function SliderBtn({ next }: { next: boolean }) {
  const swiper = useSwiper();
  return (
    <button
      className={`w-[30px] h-[30px] max-[1200px]:hidden absolute top-[50%] translate-y-[-50%] z-[999999] cursor-pointer ${
        next ? " right-0 " : " left-0 "
      }`}
      onClick={() => (next ? swiper.slideNext() : swiper.slidePrev())}
    >
      <img
        src="/assets/sliderbtn/left.png"
        alt="products"
        className={`w-full ${next ? "" : "rotate-180"}`}
      />
    </button>
  );
}
