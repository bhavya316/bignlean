"use client";
import {
  AuthencityIcon,
  CartIcon,
  CertificateIcon,
  FaqIcon,
  FlashSaleIcon,
  BlogIcon,
  MenuIcon,
  MyOrderIcon,
  ReferIcon,
  ReviewsIcon,
  WalletIcon,
} from "@/Icons";
import BrandLogo from "@/Icons/BrandLogo";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { logout } from "@/queries/Auth";
import { useGetAllCategories } from "@/queries/dataHandlers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import DeliverTo from "./DeliverTo/DeliverTo";
import SearchForProducts from "./SearchForProducts/SearchForProducts";
import Sidebar from "./Sidebar/Sidebar";
import BMRIcon from "@/Icons/BMRIcon";
import FitnessIcon from "@/Icons/FitnessIcon";
import { API_CONFIG } from "@/config/api";

// Placeholder icon for Shop by Category (you can replace with your actual icon)
const CategoryIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Back Arrow Icon for the submenu
const BackArrowIcon = () => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18l-6-6 6-6"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plus/Minus Icon for expandable categories
const ToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={isOpen ? "M2 8h12" : "M8 2v12M2 8h12"}
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

type ProfileOption = {
  link: string;
  label: string;
  icon: ReactNode;
};

const profileOptions: ProfileOption[] = [
  { icon: <MyOrderIcon />, label: "My Orders", link: "/track-order" },
  { icon: <WalletIcon />, label: "Wallet", link: "/wallet" },
  { icon: <BMRIcon />, label: "BMR", link: "/bmr" },
  {
    icon: <FitnessIcon />,
    label: "Fitness",
    link: "/fitness",
  },
  { icon: <ReferIcon />, label: "Refer a Friend", link: "/refer-friend" },
  { icon: <FlashSaleIcon />, label: "Flash Sale", link: "/" },
  { icon: <ReviewsIcon />, label: "My Reviews", link: "/reviews" },
  { icon: <AuthencityIcon />, label: "Authenticity", link: "/authenticity" },
  { icon: <BlogIcon />, label: "Blogs", link: "/blogs" },
  { icon: <FaqIcon />, label: "FAQs", link: "/faq" },
  { icon: <CertificateIcon />, label: "Certificates", link: "/app-certificates" },
];

export default function NavBar() {
  const { userData } = useAppContext();
  const [toggle, setToggle] = useState(false);

  return (
    <div className="bg-light-grey">
      {toggle && <MobileSideBar auth={userData} setToggle={setToggle} />}
      <div className="max-w-[1300px] mx-auto py-[20px] flex items-center gap-[35px] max-[1300px]:px-5 max-[500px]:px-5">
        <div
          onClick={() => setToggle(true)}
          className="hidden flex-1 max-[750px]:block"
        >
          <MenuIcon />
        </div>
        <Link
          href="/"
          className="min-w-[143px] flex items-center justify-center mt-2"
        >
          <BrandLogo />
        </Link>
        <div className="max-[750px]:hidden flex items-center justify-center">
          <DeliverTo />
        </div>
        <div className="max-[1200px]:hidden flex items-center justify-center">
          <SearchForProducts />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

const MobileSideBar = ({
  setToggle,
  auth,
}: {
  setToggle: Dispatch<SetStateAction<boolean>>;
  auth: any;
}) => {
  const router = useRouter();
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categorySubcategories, setCategorySubcategories] = useState<any>({});
  const { data: categoryData } = useGetAllCategories();
  interface Category {
    id: number;
    name: string;
    image?: string;
  }

  interface Subcategory {
    id: number;
    name: string;
    categoryId?: number;
  }
  // Fetch subcategories when a category is expanded
  useEffect(() => {
    if (expandedCategory && categoryData?.categories) {
      const category = categoryData.categories.find((cat: Category) => cat.name === expandedCategory);
      if (category && !categorySubcategories[category.id]) {
        fetch(`${API_CONFIG.BASE_URL}/subcategories/${category.id}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.status && data.subcategories) {
              setCategorySubcategories((prev: any) => ({
                ...prev,
                [category.id]: data.subcategories,
              }));
            }
          })
          .catch((error) => console.error("Error fetching subcategories:", error));
      }
    }
  }, [expandedCategory, categoryData]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 linear-gradient-1 z-[100000] hidden max-[750px]:block">
      <button
        onClick={() => setToggle(false)}
        className="absolute top-[7%] left-5"
      >
        <WhiteCrossIcon />
      </button>

      {/* Main Menu */}
      {!showCategories && (
        <div className="flex flex-col gap-5 mt-[110px] ml-8 overflow-y-auto h-[calc(100%-180px)] pr-4">
          <Link
            className="flex items-center gap-3 text-white"
            href={"/cart"}
            onClick={() => setToggle(false)}
          >
            <span>
              <CartIcon />
            </span>
            My Cart
          </Link>

          {/* Shop by Category Option */}
          <div
            className="flex items-center gap-3 text-white cursor-pointer"
            onClick={() => setShowCategories(true)}
          >
            <span>
              <CategoryIcon />
            </span>
            Shop by Category
          </div>

          {profileOptions.map((option, index) => (
            <Link
              key={index}
              className="flex items-center gap-3 text-white"
              href={option.link}
              onClick={() => setToggle(false)}
            >
              <span>{option.icon}</span>
              {option.label}
            </Link>
          ))}
        </div>
      )}

      {/* Categories Submenu (280px to 450px) */}
      {showCategories && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-[100001] flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center p-4 border-b">
            <button onClick={() => setShowCategories(false)} className="mr-3">
              <BackArrowIcon />
            </button>
            <p className="text-[16px] font-semibold text-gray-800">Category</p>
          </div>

          {/* Categories List - Scrollable */}
          <div className="flex flex-col overflow-y-auto h-[calc(100%-60px)]">
            {categoryData?.categories?.map((category: Category) => (
              <div key={category.id} className="border-b">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleCategory(category.name)}
                >
                  <p className="text-[16px] font-normal text-gray-800">
                    {category.name}
                  </p>
                  <ToggleIcon isOpen={expandedCategory === category.name} />
                </div>
                {expandedCategory === category.name && (
                  <div className="pl-8 pb-4 max-h-[200px] overflow-y-auto">
                    {categorySubcategories[category.id] ? (
                      categorySubcategories[category.id].map((subcategory: Subcategory) => (
                        <Link
                          href={`/shop-by-brands?category=${category.id}`}
                          key={subcategory.id}
                          onClick={() => {
                            sessionStorage.setItem('selectedCategoryId', category.id.toString());
                            sessionStorage.setItem('selectedCategoryName', category.name);
                            setToggle(false);
                          }}
                          className="block py-2 px-2 text-[14px] text-gray-700 hover:text-[#FF0012] hover:bg-gray-50"
                        >
                          {subcategory.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-[14px] text-gray-400 py-1">Loading subcategories...</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {!categoryData?.categories && (
              <div className="p-4">
                <p className="text-[14px] text-gray-400">Loading categories...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout/SignIn Button */}
      {auth && (
        <div
          onClick={() => logout()}
          className="flex absolute bottom-5 left-8 gap-3 cursor-pointer"
        >
          <LogoutIcon />
          <p className="text-white text-base not-italic font-semibold">
            Logout
          </p>
        </div>
      )}
      {!auth && (
        <div
          onClick={() => router.push("/login")}
          className="flex absolute bottom-5 left-8 gap-3 cursor-pointer"
        >
          <LogoutIcon />
          <p className="text-white text-base not-italic font-semibold">
            SignIn
          </p>
        </div>
      )}
    </div>
  );
};

const LogoutIcon = () => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.47458 2.71526C8.16252 1.58997 10.3797 2.62162 10.7085 4.51637H14C15.5188 4.51637 16.75 5.74759 16.75 7.26637C16.75 7.68058 16.4142 8.01637 16 8.01637C15.5858 8.01637 15.25 7.68058 15.25 7.26637C15.25 6.57601 14.6904 6.01637 14 6.01637H10.75V18.5164H14C14.6904 18.5164 15.25 17.9567 15.25 17.2664C15.25 16.8522 15.5858 16.5164 16 16.5164C16.4142 16.5164 16.75 16.8522 16.75 17.2664C16.75 18.7852 15.5188 20.0164 14 20.0164H10.7085C10.3797 21.9111 8.16252 22.9428 6.47458 21.8175L4.47457 20.4841C3.70953 19.9741 3.25 19.1155 3.25 18.196V6.33674C3.25 5.41727 3.70953 4.55863 4.47457 4.0486L6.47458 2.71526ZM15.5302 9.73603C15.8231 10.0289 15.8231 10.5038 15.5302 10.7967L14.8105 11.5164L19.9998 11.5164C20.4141 11.5164 20.7499 11.8521 20.7499 12.2664C20.7499 12.6806 20.4141 13.0164 19.9998 13.0164L14.8105 13.0164L15.5302 13.736C15.8231 14.0289 15.8231 14.5038 15.5302 14.7967C15.2373 15.0896 14.7624 15.0896 14.4695 14.7967L13.1766 13.5038C12.4932 12.8204 12.4932 11.7123 13.1766 11.0289L14.4695 9.73603C14.7624 9.44313 15.2373 9.44313 15.5302 9.73603Z"
        fill="white"
      />
    </svg>
  );
};

const WhiteCrossIcon = () => {
  return (
    <svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_717_9035)">
        <path
          d="M5.09766 1L21.3611 17.2635"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M5.09766 17.2637L21.3611 1.00022"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_717_9035"
          x="0.0976562"
          y={0}
          width="26.2637"
          height="26.2637"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_717_9035"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_717_9035"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
