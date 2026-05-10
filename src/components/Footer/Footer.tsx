"use client";
import Link from "next/link";
import ProfileImages from "../Navbar/Profile/ProfileImages";
import DownloadApp from "./DownloadApp";
import FollowUs from "./FollowUs";
import Subscribe from "./Subscribe";
import { useGetPopularBrands } from "@/queries/dataHandlers";
import { usePathname, useRouter } from "next/navigation";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";

type SiteLinks = {
  heading: string;
  links: {
    label: string;
    link: string;
  }[];
}[];
const aboutSite = [
  { label: "About us", link: "/aboutus" },
  { label: "Contact us", link: "/contact-us" },
  { label: "Refer & Earn", link: "/refer-friend" },
  { label: "Authenticity Guaranteed", link: "/authenticity" },
];
const useFulLinks = [
  { label: "Returns and Refunds", link: "/returns-and-refunds" },
  { label: "Terms and Conditions", link: "/terms-and-conditions" },
  { label: "Privacy Policy", link: "/privacy-policy" },
  { label: "Track your Shipment", link: "/track-order" },
];

export default function Footer() {
  const { data: brandsData } = useGetPopularBrands();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatchContext();
  const showBnlDesc =
    pathname !== "/" && pathname !== "/login" && pathname !== "/signup";
  const handleBrandClick = (brandId: number) => {
    if (brandId) {
      dispatch({
        type: "SET_SELECTED_BRANDS",
        payload: `brands[]=${brandId}`,
      });
      router.push("/shop-by-brands");
    }
  };

  return (
    <>
      {showBnlDesc && (
        <div
          className={`text-sm w-[85%] max-xl:w-[95%] max-w-[1300px] mx-auto py-5 font-[Montserrat] ${
            pathname?.includes("product/")
              ? "max-sm:pb-[200px]"
              : "max-sm:pb-[80px]"
          }`}
        >
          <p className="montserrat text-base leading-relaxed">
            Bignlean.com is the only online & offline supplement store in India
            that can truly guarantee authenticity.
          </p>
          <p className="montserrat text-base leading-relaxed">
            Bignlean.com has been in the health and fitness industry for several
            years. We have been supplying nutritional products such as weight
            loss supplements, protein weight loss supplements, dietary products,
            and much more. With over a huge population of happy customers, we
            aim to spread the joy of good health among others. Our online
            supplement store is your ultimate destination for getting all the
            desired health and fitness products. From protein powder, fat
            burners, to organic whey protein we supply it all! Top quality
            products, great customer support, competitive rates, attractive
            offers, all under a single roof – Bignlean.com. We work hard to make
            you reach your goals our products along with you following proper
            diet and exercise. We are available to guide you at every step of
            shopping the supplements.
          </p>
          <p className="montserrat text-base py-2 leading-relaxed">
            Whether it's your first step towards the fitness goal or you are an
            existing professional, we can help. We have a vast range of health
            supplements categorized as per their qualities in our online shop.
            Happy Shopping.
          </p>
        </div>
      )}
      <div className="bg-black mt-auto py-[68px] px-5 max-[1060px]:hidden">
        <div className="flex max-w-[1300px] gap-10 mx-auto mb-12">
          <div className="flex-[0.75]">
            <div className="flex gap-10 mb-10">
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-lg not-italic font-semibold leading-6 text-gradient">
                  BignLean
                </h3>
                {aboutSite.map((item) => (
                  <Link
                    key={item.label}
                    className="text-white text-base not-italic font-normal leading-6"
                    href={item.link}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-lg not-italic font-semibold leading-6 text-gradient">
                  Popular Brands
                </h3>
                {brandsData?.brands
                  ?.slice(0, 5)
                  ?.map((brand: any, index: number) => (
                    <p
                      key={index}
                      onClick={() => handleBrandClick(brand?.id)}
                      className="cursor-pointer text-white text-base not-italic font-normal leading-6"
                    >
                      {brand.name}
                    </p>
                  ))}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-lg not-italic font-semibold leading-6 text-gradient">
                  UseFul Links
                </h3>
                {useFulLinks.map((item) => (
                  <Link
                    key={item.label}
                    className="text-white text-base not-italic font-normal leading-6"
                    href={item.link}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex gap-10">
              <div className="flex-[0.5]">
                <h3 className="text-lg not-italic font-semibold leading-6 text-gradient">
                  Store Address
                </h3>
                <p className="text-white text-sm not-italic font-normal font-sans leading-5">
                  Bignlean Store, Ground Floor, E-Wing, Shop no.16 & 17, Lodha
                  Freshia Building, Kalyan Shil Road, Lodha Heaven, Nilje,
                  Dombivali East, Thane, Mumbai 421204
                </p>
              </div>
              <div className="flex-[0.25]">
                <h3 className="text-lg not-italic font-semibold leading-6 text-gradient">
                  Email
                </h3>
                <Link
                  href={"mailto:support@bignlean.com"}
                  className="text-white text-sm not-italic font-normal leading-5"
                >
                  support@bignlean.com
                </Link>
              </div>
              <div className="flex-[0.25]">
                <h3 className="text-lg not-italic font-semibold leading-6 text-gradient">
                  Toll Free
                </h3>
                <Link
                  href={"tel:18002661313"}
                  className="text-white text-sm not-italic font-normal leading-5"
                >
                  1800 266 1313
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-[0.25] flex flex-col gap-4">
            <Subscribe />
            <FollowUs />
            <DownloadApp />
          </div>
        </div>
        <div className="h-[2px] mt-[30px] bg-gray-400 max-w-[1300px] mx-auto"></div>
        {/* <div className="flex justify-center pt-2">
          <ProfileImages />
        </div> */}
        <div className="max-w-[1300px] mx-auto pt-[30px] flex item-center gap-48 ">
          <p className="text-gray-600  text-sm not-italic font-normal leading-4">
            Copyright Protected 2017-{new Date().getFullYear()} © Bignlean.com.
            All Rights Reserved.<br/> Designed and developed by <a href="https://digigoatindia.com/">Digigoat india</a>
          </p>
          <div className="flex justify-center">
            <ProfileImages />
          </div>
        </div>
      </div>
    </>
  );
}
