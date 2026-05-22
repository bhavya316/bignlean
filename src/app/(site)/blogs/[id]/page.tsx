import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { ApiPaths } from "@/constants";
import { getFirstMediaUrl } from "@/utils/media";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:3002";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);

  return parts.map((part, index) => {
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-gray-100 px-1 py-0.5 text-base">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function renderBlogBody(bodyText = "") {
  return bodyText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      if (line.startsWith("### ")) {
        return <h4 key={index} className="mt-6 mb-3 text-xl font-bold text-black">{renderInlineFormatting(line.slice(4))}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={index} className="mt-8 mb-3 text-2xl font-bold text-black">{renderInlineFormatting(line.slice(3))}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={index} className="mt-8 mb-4 text-3xl font-bold text-black">{renderInlineFormatting(line.slice(2))}</h2>;
      }
      if (/^[-*]\s+/.test(line)) {
        return (
          <div key={index} className="mb-3 flex items-start">
            <span className="mr-3 mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <p className="flex-1 leading-8">{renderInlineFormatting(line.replace(/^[-*]\s+/, ""))}</p>
          </div>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        return <p key={index} className="mb-3 leading-8">{renderInlineFormatting(line)}</p>;
      }
      return <p key={index} className="mb-4 leading-8">{renderInlineFormatting(line)}</p>;
    });
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

  const blogImages = Array.isArray(blog?.images)
    ? blog.images
    : typeof blog?.images === "string"
      ? [blog.images]
      : [];
  const blogImage = getFirstMediaUrl(blogImages, "/assets/blogs/Blog_Not_Found.png");
  const createdAt = blog?.createdAt ? new Date(blog.createdAt) : null;
  const dateLabel = createdAt && !Number.isNaN(createdAt.getTime())
    ? `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`
    : "";

  return (
    <CustomPageWrapper heading="Blogs">
      <div className="w-[90%] max-[900px]:w-full mx-auto relative rounded-[20px] overflow-hidden mb-[40px]">
        <img
          src={blogImage}
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
              {dateLabel}
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
        {renderBlogBody(blog?.bodyText || blog?.body || "")}
      </div>
    </CustomPageWrapper>
  );
}
