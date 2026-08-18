"use client";
import { ReactNode } from "react";
// Import Swiper React components
import { Swiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import "swiper/css/free-mode";

import { FreeMode } from "swiper/modules";
import SliderBtn from "../SliderButtons/SliderBtn";

// type Props = {
//   children: ReactNode;
//   slidePerView?: number;
//   showBtns?: boolean;
// };
type Props = {
  children: React.ReactNode;
  slidePerView: number;
  showBtns?: boolean;
  spaceBetween?: number;
  watchSlidesProgress?: boolean;
  loopFillGroupWithBlank?: boolean;
  breakpoints?: Record<string, any>;
  // Add the missing prop
  slidesPerGroup?: number;
};
export default function SliderWrapper({
  children,
  slidePerView,
  showBtns = false,
  ...props
}: Props) {
  return (
    <Swiper
      slidesPerView={slidePerView || 3}
      spaceBetween={15}
      freeMode={true}
      modules={[FreeMode]}
      className="mySwiper mx-auto w-full relative"
      {...props}
    >
      {showBtns && (
        <>
          <SliderBtn next={true} />
          <SliderBtn next={false} />
        </>
      )}
      {children}
    </Swiper>
  );
}
