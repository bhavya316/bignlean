"use client";
import { StarIcon, TrashIcon } from "@/Icons";
import { useAppContext } from "@/provider/ContextProvider/ContextProvider";
import { useDeleteRating } from "@/queries/Rating";
import { RatingType } from "@/utils/productType";

export default function SideReviewsCard({
  ratings,
}: {
  ratings?: RatingType[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-black text-base not-italic font-semibold">
          Recent Reviews
        </p>
        {/* <ShortBy /> */}
      </div>
      <div className="flex flex-col gap-3 my-3">
        {ratings?.map((review: any, index: number) => (
          <CustomerReview
            key={index}
            custometrName={review?.user?.name}
            date={new Date(review?.createdAt).toUTCString()}
            rating={Math.floor(review?.rate)}
            review={review?.review}
            imgs={review?.images}
            userId={review?.user?.id}
            ratingId={review?.id}
          />
        ))}
      </div>
      {/* {ratings?.length > 0 && (
        <p className="text-gradient text-sm not-italic font-semibold cursor-pointer hover:underline">
          View all {ratings?.length} Reviews
        </p>
      )} */}
    </div>
  );
}

const CustomerReview = ({
  custometrName,
  date,
  rating,
  review,
  imgs,
  userId,
  ratingId,
}: {
  custometrName: string;
  rating: number;
  date: string;
  review: string;
  imgs?: string[];
  userId: number;
  ratingId: number;
}) => {
  const { userData } = useAppContext();
  const { mutate: deleteRating } = useDeleteRating();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-black text-sm not-italic font-bold">
            {custometrName || "Anonymous"}
          </p>
          <div className="flex items-center gap-1">
            {new Array(rating).fill(null).map((_, index) => (
              <div key={index} className="scale-75">
                <StarIcon />
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 not-italic text-[10px] flex items-center gap-2">
          {date}
          {/* <button><EditIcon /></button> */}
          {userId === Number(userData?.id) && (
            <button onClick={() => deleteRating(ratingId)}>
              <TrashIcon />
            </button>
          )}
        </p>
      </div>
      {imgs && (
        <div className="mb-4 flex gap-2">
          {imgs?.length > 0 &&
            imgs.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="product"
                className="w-20 h-20 rounded-lg overflow-hidden flex items-center "
              />
            ))}
        </div>
      )}
      <p className="text-black text-sm not-italic font-normal">{review}</p>
      <div className="w-full h-[2px] bg-gray-200 my-3"></div>
    </div>
  );
};

const ReviewWithImage = () => {
  return (
    <div>
      <p className="text-black text-base not-italic font-semibold mb-3">
        Reviews with Images
      </p>
      <div className="flex gap-4 flex-wrap">
        <div className="w-[56px] h-[56px] p-3 rounded-lg overflow-hidden bg-slate-200 flex items-center ">
          <img src="/assets/product.png" alt="product" className="w-full " />
        </div>
        <div className="w-[56px] h-[56px] p-3 rounded-lg overflow-hidden bg-slate-200 flex items-center ">
          <img src="/assets/product.png" alt="product" className="w-full " />
        </div>
        <div className="w-[56px] h-[56px] p-3 rounded-lg overflow-hidden bg-slate-200 flex items-center ">
          <img src="/assets/product.png" alt="product" className="w-full " />
        </div>
        <div className="w-[56px] h-[56px] p-3 rounded-lg overflow-hidden bg-slate-200 flex items-center ">
          <img src="/assets/product.png" alt="product" className="w-full " />
        </div>
        <div className="w-[56px] h-[56px] p-3 rounded-lg overflow-hidden bg-slate-200 flex items-center ">
          <img src="/assets/product.png" alt="product" className="w-full " />
        </div>
      </div>
    </div>
  );
};

const ShortBy = () => {
  return (
    <button className="flex items-center gap-2">
      <svg
        width="18"
        height="13"
        viewBox="0 0 18 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 0.5H17C17.5522 0.5 18 0.947766 18 1.5C18 2.05223 17.5522 2.5 17 2.5H1C0.447766 2.5 0 2.05223 0 1.5C0 0.947766 0.447766 0.5 1 0.5ZM1 5.5H11C11.5522 5.5 12 5.94777 12 6.5C12 7.05223 11.5522 7.5 11 7.5H1C0.447766 7.5 0 7.05223 0 6.5C0 5.94777 0.447766 5.5 1 5.5ZM1 10.5H5C5.55223 10.5 6 10.9478 6 11.5C6 12.0522 5.55223 12.5 5 12.5H1C0.447766 12.5 0 12.0522 0 11.5C0 10.9478 0.447766 10.5 1 10.5Z"
          fill="black"
        />
      </svg>
      <p>Sort by</p>
    </button>
  );
};
