"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { Blog } from "@/utils/Schemas";

type Props = {
  blogData: Blog[];
};
export default function BlogCarosoul({ blogData }: Props) {
  const router = useRouter();
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + "</span>";
    },
  };
  return (
    <div>
      <Swiper
        pagination={pagination}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper w-full h-[375px] rounded-[20px] "
      >
        {blogData.map((blog, index) => (
          <SwiperSlide
            key={index}
            onClick={() => router.push(`/blogs/${blog.id}`)}
            className="relative cursor-pointer"
          >
            <img
              src={blog?.images[0]}
              alt="blog image"
              width={700}
              height={400}
              className="w-full h-full bg-center object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-10 left-4 w-[395px] max-[395px]:w-full z-10">
              <div className="flex items-center gap-5 mb-4">
                <p className="text-white text-base not-italic font-medium bg-black p-1 px-2 rounded-[30px]">
                  {blog?.category}
                </p>
                <p className="text-white text-base not-italic font-semibold">
                  {new Date(blog.createdAt).getDate() +
                    "-" +
                    new Date(blog.createdAt).getMonth() +
                    "-" +
                    new Date(blog.createdAt).getFullYear()}
                </p>
                <p className="text-white text-base not-italic font-normal">
                  {blog?.duration} mins read
                </p>
              </div>
              <h2 className="text-white text-3xl not-italic font-bold">
                {blog?.heading}
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
