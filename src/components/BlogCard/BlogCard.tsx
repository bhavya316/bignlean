"use client";
import { Blog } from "@/utils/Schemas";
import { useRouter } from "next/navigation";
type Props = {
  blogData: Blog;
  index: number;
  arr: Blog[];
};

export default function BlogCard({ blogData, arr, index }: Props) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/blogs/" + blogData.id)}
      className={`flex gap-[22px] cursor-pointer  ${
        index === arr!.length - 1 || "border-b-2 border-gray-200"
      } pb-6`}
    >
      <div className="w-[120px] h-[120px] rounded-[18px] overflow-hidden">
        <img src={blogData.images[0]} alt="Blog" className="w-full h-full" />
      </div>
      <div>
        <h2 className="text-gray-700 text-lg not-italic font-medium mb-[15px]">
          {blogData.category}
        </h2>
        <h3 className="text-black text-xl not-italic font-bold mb-2">
          {blogData.heading}
        </h3>
        <div className="flex items-center gap-[10px]">
          <p className="text-gray-500 text-base not-italic font-semibold">
            {new Date(blogData.createdAt).getDate() +
              "-" +
              new Date(blogData.createdAt).getMonth() +
              "-" +
              new Date(blogData.createdAt).getFullYear()}
          </p>
          <p className="w-1 h-1 rounded-full bg-gray-500"></p>
          <p className="text-gray-500 text-base not-italic font-normal">
            {blogData?.duration}
          </p>
        </div>
      </div>
    </div>
  );
}
