"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { API_CONFIG } from "@/config/api";
import { ApiPaths } from "@/constants";

type Props = {};

export default function BreadCrumbs({ }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatchContext();
  const [comboProductName, setComboProductName] = useState<string>("");
  const [blogHeading, setBlogHeading] = useState<string>("");
  const [productDetails, setProductDetails] = useState<{
    brandName: string;
    categoryName: string;
    productName: string;
    brandId: number;
    catId: number;
  } | null>(null);

  const paths = (pathname || "").split("/");

  // Fetch combo product name if on combo page
  useEffect(() => {
    if (pathname?.includes("/combo/")) {
      const comboId = pathname.split("/combo/")[1]?.split("/")[0];
      if (comboId && /^\d+$/.test(comboId)) {
        // Fetch combo product details
        fetch(`${API_CONFIG.BASE_URL}${ApiPaths.COMBO_PRODUCT}/${comboId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data?.status && data?.result?.name) {
              setComboProductName(data.result.name);
            }
          })
          .catch((error) => {
            console.error("Error fetching combo product:", error);
          });
      }
    }
  }, [pathname]);

  // Fetch blog heading if on blog details page
  useEffect(() => {
    if (pathname?.includes("/blogs/") && !pathname?.endsWith("/blogs")) {
      const blogId = pathname.split("/blogs/")[1]?.split("/")[0];
      if (blogId && /^\d+$/.test(blogId)) {
        fetch(`${API_CONFIG.BASE_URL}${ApiPaths.BLOGS}/${blogId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data?.status && data?.blog?.heading) {
              setBlogHeading(data.blog.heading);
            }
          })
          .catch((err) => console.error("Error fetching blog heading:", err));
      }
    }
  }, [pathname]);

  // Fetch product details for breadcrumbs if on product page
  useEffect(() => {
    const productId = searchParams?.get("id");
    if (pathname?.includes("/product/") && productId) {
      fetch(`${API_CONFIG.BASE_URL}${ApiPaths.PRODUCTS}/${productId}/0`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.status && data?.result) {
            const res = data.result;
            // Fetch category name
            fetch(`${API_CONFIG.BASE_URL}/category/${res.catId}`)
              .then((res) => res.json())
              .then((catData) => {
                setProductDetails({
                  brandName: res.brandName,
                  categoryName: catData?.category?.name || "",
                  productName: res.name,
                  brandId: res.brandId,
                  catId: res.catId,
                });
              });
          }
        })
        .catch((err) => console.error("Error fetching product details:", err));
    } else {
      setProductDetails(null);
    }
  }, [pathname, searchParams]);

  function createCrumbs(paths: string[]) {
    const crumbs: string[] = [];
    let path = "";
    paths.forEach((_path, index) => {
      path += index === 0 ? `${_path}` : `/${_path}`;
      crumbs.push(path);
    });

    return crumbs;
  }

  const breads = createCrumbs(paths);

  const myBreads = breads.splice(0, paths.length - 1);
  if (breads[0] === "/") return;

  const truncate = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const handleBrandClick = () => {
    if (productDetails?.brandId) {
      sessionStorage.removeItem("selectedCategoryId");
      sessionStorage.removeItem("selectedCategoryName");
      sessionStorage.removeItem("selectedSubcategoryId");
      sessionStorage.removeItem("selectedSubcategoryName");

      dispatch({
        type: "SET_SELECTED_BRANDS",
        payload: `brands[]=${productDetails.brandId}`,
      });
      router.push("/shop-by-brands");
    }
  };

  return (
    <div className="w-full  max-w-[1300px] px-4 sm:px-6 lg:px-16 mx-auto py-2 text-center flex gap-2 justify-start items-center">
      {productDetails && pathname?.includes("/product/") ? (
        <>
          <Link
            href="/"
            className="capitalize text-sm text-[#001942] font-light max-sm:text-[10px]"
          >
            Home
          </Link>
          <span className="text-[#001942] mx-1">/</span>
          <span
            onClick={handleBrandClick}
            className="capitalize text-sm text-[#001942] font-light max-sm:text-[10px] cursor-pointer hover:text-primary transition-colors"
          >
            {productDetails.brandName}
          </span>
          {productDetails.categoryName && (
            <>
              <span className="text-[#001942] mx-1">/</span>
              <Link
                href={`/shop-by-brands?category=${productDetails.catId}`}
                className="capitalize text-sm text-[#001942] font-light max-sm:text-[10px] hover:text-primary transition-colors"
              >
                {productDetails.categoryName}
              </Link>
            </>
          )}
          <span className="text-[#001942] mx-1">/</span>
          <span className="capitalize text-sm max-sm:text-[10px] text-[#E70F0F] line-clamp-1 text-start cursor-pointer">
            {truncate(productDetails.productName, 30)}
          </span>
        </>
      ) : (
        <>
          {myBreads.map((path, index) => (
            <React.Fragment key={index}>
              <Link
                href={path || "/"}
                className="capitalize text-sm text-[#001942] font-light max-sm:text-[10px]"
              >
                {path === ""
                  ? "Home"
                  : path.includes("/combo/") &&
                    /^\d+$/.test(path.split("/").pop() || "")
                    ? comboProductName || "Combo Product"
                    : path.includes("/blogs/") &&
                      /^\d+$/.test(path.split("/").pop() || "")
                      ? truncate(blogHeading, 15) || "Blog"
                      : path
                        .split("/")
                      [path.split("/").length - 1].split("-")
                        .join(" ")}
              </Link>
              {index < myBreads.length - 1 && (
                <span className="text-[#001942] mx-1">/</span>
              )}
            </React.Fragment>
          ))}
          <span className="capitalize text-sm max-sm:text-[10px]  text-[#E70F0F] line-clamp-1 text-start  cursor-pointer">
            {(() => {
              const currentPath = breads[breads.length - 1];
              const lastSegment = currentPath
                .split("/")
              [currentPath.split("/").length - 1];

              // If it's a combo page with numeric ID, show the actual product name
              if (currentPath.includes("/combo/") && /^\d+$/.test(lastSegment)) {
                return comboProductName || "Combo Product";
              }

              // If it's a blog detail page with numeric ID, show the actual blog heading
              if (currentPath.includes("/blogs/") && /^\d+$/.test(lastSegment)) {
                return truncate(blogHeading, 30) || "Blog Details";
              }

              return decodeURIComponent(lastSegment.split("-").join(" "));
            })()}
          </span>
        </>
      )}
    </div>
  );
}
