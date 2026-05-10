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
    console.error("Error fetching blogs:", error);
    return [];
  }
}

async function getBlogById(id: string) {
  try {
    const res = await fetch(`${baseUrl}${ApiPaths.BLOGS}/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.blog || null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// Add this function to generate all possible blog paths at build time
export async function generateStaticParams() {
  const blogs = await getAllBlogs();

  return blogs.map((blog: Blog) => ({
    id: blog.id.toString()
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params?.id;
  const blog = await getBlogById(id);

  if (!blog) {
    return (
      <CustomPageWrapper heading="Blogs">
        <p>Not a valid blog id</p>
      </CustomPageWrapper>
    );
  }

  return (
    <CustomPageWrapper heading="Blogs">
      <div className="w-[90%] max-[900px]:w-full mx-auto relative rounded-[20px] overflow-hidden mb-[40px]">
        <img
          src={blog?.images[0]}
          alt="blog image"
          className="w-full object-cover bg-center max-h-[500px] object-center max-[550px]:h-[300px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className=" text-white p-2 absolute bottom-10 left-4 w-[60%] max-[521px]:w-full z-10">
          <div className="flex items-center gap-5 mb-4">
            <p className=" text-base not-italic font-medium bg-black p-1 px-2 rounded-[30px]">
              {blog?.category}
            </p>
            <p className=" text-base not-italic font-semibold">
              {blog &&
                new Date(blog?.createdAt).getDate() +
                "-" +
                new Date(blog?.createdAt).getMonth() +
                "-" +
                new Date(blog?.createdAt).getFullYear()}
            </p>
            <p className=" text-base not-italic font-normal">
              {blog?.duration} mins read
            </p>
          </div>
          <h2 className=" not-italic font-bold text-[40px] max-[550px]:text-2xl leading-tight">
            {blog?.heading}
          </h2>
        </div>
      </div>
      <div className="text-gray-700 w-[95%] max-lg:w-full mx-auto text-lg not-italic font-normal mb-6">
        {blog?.bodyText?.split('\n')
          .filter((paragraph: string) => paragraph.trim() !== '')
          .map((paragraph: string, index: number) => (
            <div key={index} className="flex items-start mb-4">
              <span className="text-gray-700 mr-2 text-xl font-bold" >•</span>
              <p className="flex-1">
                {paragraph.trim()}
              </p>
            </div>
          ))}
      </div>
    </CustomPageWrapper>
  );
}
