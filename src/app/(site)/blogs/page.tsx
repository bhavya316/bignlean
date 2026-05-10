import { BlogCard, BlogCarosoul } from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { ApiPaths } from "@/constants";
import { Blog } from "@/utils/Schemas";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:3002";

async function getAllBlogs() {
  try {
    const res = await fetch(baseUrl + ApiPaths.BLOGS, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.blogs || [];
  } catch (error) {
    console.error("Fetch blogs failed:", error);
    return [];
  }
}

export default async function Page() {
  const blogsData = (await getAllBlogs()) as Blog[];

  if (!blogsData || blogsData.length === 0) {
    return (
      <CustomPageWrapper heading="Blogs">
        <div className="flex flex-col items-center justify-center my-10">
          <img
            src="/assets/blogs/Blog_Not_Found.png"
            alt="No Blogs Found"
            className="w-[400px] h-auto object-contain"
          />
          <h2 className="text-xl font-semibold mt-6 text-gray-600">No Blogs Found</h2>
        </div>
      </CustomPageWrapper>
    );
  }

  return (
    <CustomPageWrapper heading="Blogs">
      <div className="w-[666px] max-[666px]:w-full mx-auto mb-[65px]">
        <BlogCarosoul blogData={blogsData} />
      </div>
      <div className="w-[1000px] max-[900px]:w-full mx-auto">
        <h2 className="text-black text-2xl not-italic font-bold mb-[34px]">
          Latest Blogs
        </h2>
        <div className="flex flex-col gap-6">
          {blogsData.map((blog, index, arr) => (
            <BlogCard key={index} blogData={blog} arr={arr} index={index} />
          ))}
        </div>
      </div>
    </CustomPageWrapper>
  );
}
