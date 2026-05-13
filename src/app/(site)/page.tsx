"use client";
import {
  DownloadBanner,
  HomeCarosoul,
  Banner1Section,
  Banner2Section,
  Banner3Section,
  Quotes,
  RecentlyViewed,
  BestSeller,
  ExtraOffFreebies,
  FitFoodRange,
  PopularProducts,
  PickOfTheDay,
  BuyTwoOff,
  ShopByBrands,
  ShopByCategory,
  ComboCategorySection,
} from "@/components";
import SearchForProducts from "@/components/Navbar/SearchForProducts/SearchForProducts";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGEtWishList } from "@/queries/Product";
import {
  useGetAllBanners,
  useGetAllBrands,
  useGetAllCategories,
  useGetAllHomeProducts,
  useGetComboCategories,
} from "@/queries/dataHandlers";
import FirstOfferModal from "@/components/Home/FirstOfferModal";
import Link from "next/link";

export default function Home() {
  const { data: brandsData, isLoading: brandsLoading } = useGetAllBrands();
  const { data: bannersData, isLoading: bannersLoading } = useGetAllBanners();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategories();
  const { data: homeProducts, isLoading: homeProductsLoading } = useGetAllHomeProducts();
  const { data: comboCategoriesData, isLoading: comboCategoriesLoading } = useGetComboCategories();
  const { userData } = useAppContext();

  // Filter banners by type
  const heroSliderBanners = bannersData?.banner?.filter((banner: any) => banner.type === "Hero Slider") || [];
  const banner1SectionBanners = bannersData?.banner?.filter((banner: any) => banner.type === "Banner 1 Section") || [];
  const banner2SectionBanners = bannersData?.banner?.filter((banner: any) => banner.type === "Banner 2 Section") || [];
  const banner3SectionBanners = bannersData?.banner?.filter((banner: any) => banner.type === "Banner 3 Section") || [];
  useGEtWishList(userData?.id as number);
  return (
    <div className="max-sm:pb-10 bg-[#f5f7fa]">
      <FirstOfferModal />
      <div className="hidden  justify-center max-[750px]:flex mb-4 max-[500px]:px-5">
        <SearchForProducts />
      </div>
        <HomepageHeroDeck
          isLoading={bannersLoading}
          heroBanners={heroSliderBanners}
        />
        <MarketplaceTrustStrip />

      <div className="max-xl:w-[95%] mx-auto">
        <div className="max-[800px]:hidden">
          <ShopByBrands brandsData={brandsData?.brands} isLoading={brandsLoading} />
        </div>

        <div className="max-[800px]:hidden">
          <ShopByCategory categoriesData={categoriesData?.categories} isLoading={categoriesLoading} />
        </div>

        <Banner1SectionWrapper
          isLoading={bannersLoading}
          banners={banner1SectionBanners}
        />

        <PopularProducts isLoading={homeProductsLoading} />
        
        <BuyTwoOff />
        
        {/* <Quotes
          authorName="Michael John Bobak"
          quote="“All progress takes place outside the comfort zone.”"
        /> */}
        {/* {homeProducts?.data
          ?.filter((item: any) => item.type === "Single")
          .map((item: any, index: number, array: any[]) => {
            // Render the product section
            const productSection = (
              <ProductSection
                key={index}
                products={item?.products}
                sectionName={item?.name}
                expiryTime={item?.expireDateTime || null}
                type={item?.type}
              />
            );

            // Insert the banner after "Buy 2 @ 15% Off" section
            if (item?.name === "Buy 2 @ 15% Off") {
              return (
                <React.Fragment key={`section-${index}`}>
                  {productSection}
                  <div className="my-8 flex justify-center">
                    <img
                      src="/Group 33739.png"
                      alt="Become a Member Now"
                      className="w-[972px] h-[386px] rounded-[10px] object-cover"
                    />
                  </div>
                  <div className="max-[800px]:hidden">
                    {comboCategoriesData?.comboCategories?.map((category: any) => (
                      <ComboCategorySection key={category.comboCategoryId} comboCategory={category} />
                    ))}
                  </div>
                </React.Fragment>
              );
            }



            return productSection;
          })} */}
                    {comboCategoriesLoading ? (
                      <ComboCategoriesSkeleton />
                    ) : (
                      comboCategoriesData?.comboCategories?.map((category: any) => (
                        <ComboCategorySection key={category.comboCategoryId} comboCategory={category} />
                      ))
                    )}

        <Banner2SectionWrapper
          isLoading={bannersLoading}
          banners={banner2SectionBanners}
        />

        {homeProductsLoading ? <PickOfTheDaySkeleton /> : <PickOfTheDay />}

        <Quotes
          authorName="Arnold Schwarzenegger"
          quote="There are no shortcuts. Everything is reps, reps, reps."
        />

        {/*
        <Quotes
          authorName="Arnold Schwarzenegger"
          quote="“There are no shortcuts. Everything is reps, reps, reps. --”"
        />
        */}
        {homeProductsLoading ? (
          <DynamicComboSectionsSkeleton />
        ) : (
          homeProducts?.data
            ?.filter((item: any) => item.type === "Combo")
            .map((item: ComboType) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 py-10 w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full max-xl:px-5"
              >
                <p className="font-semibold text-2xl">{item.name}</p>
                <div className="w-full grid grid-cols-4 gap-5">
                  {item.products.map((combo) => (
                    <Link key={combo.id} href={`/combo/${combo?.id}`}>
                      <div className="w-full aspect-square rounded">
                        <img
                          src={combo.image}
                          alt="offer"
                          className=" object-cover rounded w-full h-full"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
        )}



        {homeProductsLoading ? <RecentlyViewedSkeleton /> : <RecentlyViewed />}

        {homeProductsLoading ? <BestSellerSkeleton /> : <BestSeller />}

        <ExtraOffFreebies />

        {/*
        <Quotes
          authorName="Arnold Schwarzenegger"
          quote="“There are no shortcuts. Everything is
           reps, reps, reps.”"
        />
        */}

        {/*
        <Quotes
          authorName="Arnold Schwarzenegger"
          quote="“The last three or four reps is what makes the muscle grow.”"
        />
        */}

        <FitFoodRange />

        {/*
        <Quotes
          authorName="Michael John Bobak"
          quote="“All progress takes place outside the comfort zone.”"
        />
        */}

        <Banner3SectionWrapper
          isLoading={bannersLoading}
          banners={banner3SectionBanners}
        />
      
        <div className="max-[1100px]:hidden">
          <DownloadBanner />
        </div>
        <MarketplaceSeoBlock />
      </div>
    </div>
  );
}

// Loading Skeleton Components

function HomepageHeroDeck({
  isLoading,
  heroBanners,
}: {
  isLoading: boolean;
  heroBanners: any[];
}) {
  return (
    <div className="w-[1200px] max-[1200px]:w-full mx-auto px-4 pt-5">
      <div className="min-w-0 bg-white rounded-lg p-2 shadow-sm">
        {isLoading ? <HomeCarosoulSkeleton /> : <HomeCarosoul bannersData={heroBanners} className="!px-0 !w-full" />}
      </div>
    </div>
  );
}

function MarketplaceTrustStrip() {
  const items = [
    ["100% Authentic", "Verified products and invoices"],
    ["Fast Delivery", "Serviceability-aware shipping"],
    ["Best Deals", "Coupons, combos and flash pricing"],
    ["Easy Support", "Order tracking and help pages"],
  ];

  return (
    <div className="w-[1200px] max-[1200px]:w-full mx-auto px-4 mt-4">
      <div className="grid grid-cols-4 max-[850px]:grid-cols-2 max-[480px]:grid-cols-1 bg-white border border-gray-200 rounded-lg divide-x max-[850px]:divide-x-0 max-[850px]:divide-y shadow-sm">
        {items.map(([title, subtitle]) => (
          <div key={title} className="p-4">
            <p className="text-sm font-bold text-black">{title}</p>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketplaceSeoBlock() {
  return (
    <div className="w-[1200px] max-[1200px]:w-full mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-700">
        <h2 className="text-black text-xl font-bold mb-3">
          Sports Nutrition, Wellness and Fitness Supplements
        </h2>
        <p className="text-sm leading-6">
          Bignlean brings protein powders, creatine, vitamins, healthy foods and performance
          essentials into one shopping experience. Compare variants, check stock, review origin
          country details, apply coupons and build combo packs from the same catalogue used by the
          admin panel.
        </p>
        <div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1 gap-4 mt-6">
          {[
            ["Protein", "Whey, isolate and daily protein support"],
            ["Performance", "Creatine and pre-workout essentials"],
            ["Wellness", "Vitamins, immunity and daily health"],
            ["Foods", "Protein snacks and clean pantry picks"],
          ].map(([title, text]) => (
            <div key={title} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-black">{title}</p>
              <p className="text-xs text-gray-500 mt-2 leading-5">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function ComboCategoriesSkeleton() {
  return (
    <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px] px-5">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-[15px] shadow-lg p-3 animate-pulse">
            <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export type ComboType = {
  id: number;
  name: string;
  type: "Single" | "Combo";
  products: {
    id: number;
    image: string;
    name: string;
  }[];
  isForLimitedTime: boolean;
  expireDateTime: string;
  createdAt: string;
  updatedAt: string;
};

// Loading Skeleton Components
function HomeCarosoulSkeleton() {
  return (
    <div className="w-full mx-auto py-4">
      <div className="w-full h-[300px] bg-gray-200 rounded-3xl animate-pulse mx-auto"></div>
    </div>
  );
}

function PickOfTheDaySkeleton() {
  return (
    <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px] px-5">
      <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-[15px] shadow-lg p-3 animate-pulse">
            <div className="w-full h-[140px] bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentlyViewedSkeleton() {
  return (
    <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px] px-5">
      <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-[15px] shadow-lg p-3 animate-pulse">
            <div className="w-full h-[140px] bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BestSellerSkeleton() {
  return (
    <div className="w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full flex flex-col gap-[40px] px-5">
      <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-[15px] shadow-lg p-3 animate-pulse">
            <div className="w-full h-[140px] bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DynamicComboSectionsSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-10 w-[1200px] mx-auto mt-[60px] max-[1200px]:w-full max-xl:px-5">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
      <div className="w-full grid grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-full aspect-square bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

type BannerSectionWrapperProps = {
  isLoading: boolean;
  banners: any[];
};

function Banner1SectionWrapper({ isLoading, banners }: BannerSectionWrapperProps) {
  if (isLoading) {
    return (
      <div className="my-8 flex justify-center">
        <div className="w-full max-w-[1000px] h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200 rounded-lg shadow-lg animate-pulse" />
      </div>
    );
  }
  return <Banner1Section banners={banners} />;
}

function Banner2SectionWrapper({ isLoading, banners }: BannerSectionWrapperProps) {
  if (isLoading) {
    return (
      <div className="my-8 flex justify-center">
        <div className="w-full max-w-[1000px] h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200 rounded-lg shadow-lg animate-pulse" />
      </div>
    );
  }
  return <Banner2Section banners={banners} />;
}

function Banner3SectionWrapper({ isLoading, banners }: BannerSectionWrapperProps) {
  if (isLoading) {
    return (
      <div className="my-8 flex justify-center">
        <div className="w-full max-w-[1000px] h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200 rounded-lg shadow-lg animate-pulse" />
      </div>
    );
  }
  return <Banner3Section banners={banners} />;
}
