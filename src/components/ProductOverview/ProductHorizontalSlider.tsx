"use client";
import { SwiperSlide } from "swiper/react";
import { SliderWrapper } from "..";

export default function ProductHorizontalSlider() {
  return (
    <div className="hidden max-[650px]:block w-full">
      <SliderWrapper slidePerView={5.5}>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
        <SwiperSlide className="rounded-lg bg-gray-300 p-2 cursor-pointer">
          <img src="/assets/product.png" alt="product" className="w-full" />
        </SwiperSlide>
      </SliderWrapper>
    </div>
  );
}
