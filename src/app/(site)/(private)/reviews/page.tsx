"use client";
import { ReviewCard } from "@/components";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useGetUserReviews } from "@/queries/dataHandlers";

const convertDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
};
export default function Page() {
  const { userData } = useAppContext();
  const { data } = useGetUserReviews(userData?.id as number);
  return (
    <CustomPageWrapper heading="Reviews">
      <div className="flex">
        <div className="flex-1">
          <div className="bg-white rounded-lg sm-3 p-3 flex flex-col gap-4 w-[455px] max-[500px]:w-full mb-[50px]">
            {data?.ratings.map((data: any, index: number) => (
              <div key={index} className="flex flex-col gap-4">
                <ReviewCard
                  name={userData?.name || "Anonymous"}
                  postedDate={convertDate(data?.updatedAt)}
                  rating={data?.rate}
                  review={data?.review}
                  imgs={data?.images}
                />
                {index < data?.ratings?.length - 1 && (
                  <div className="w-full h-[1px] bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
          <RecentProducts />
        </div>
        <div className="flex-1 max-[850px]:hidden">
          <img src="/assets/reviews/right.png" alt="img" className="w-full" />
        </div>
      </div>
    </CustomPageWrapper>
  );
}

const RecentProducts = () => {
  return (
    <div>
      <h3 className="text-black text-xl not-italic font-semibold mb-9">
        Recent Orders
      </h3>
      <div className="flex">
        <div className="w-[150px] flex flex-col gap-2 items-center">
          <img src="/assets/product.png" alt="product" className="w-[50px]" />
          <p className="text-black text-xs not-italic font-medium text-center">
            Muscletech NitroTech 100% Whey Gold Performance Series
          </p>
        </div>
        <div className="w-[150px] flex flex-col gap-2 items-center">
          <img src="/assets/product.png" alt="product" className="w-[50px]" />
          <p className="text-black text-xs not-italic font-medium text-center">
            Muscletech NitroTech 100% Whey Gold Performance Series
          </p>
        </div>
      </div>
    </div>
  );
};
