"use client";
import { FillStarIcon, StarIcon } from "@/Icons";
import { useDispatchContext } from "@/provider/ContextProvider/ContextProvider";
import { ProductDetailType, RatingType } from "@/utils/productType";
import { OutlinedButton } from "..";
import { Progress } from "@nextui-org/progress";

function calculateRatings(userRatings: any[]) {
  const ratings: any = {
    total_ratings: 0,
    avg_rating: 0,
    rates: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  };

  userRatings.forEach((rating) => {
    if (rating.rate >= 1 && rating.rate <= 5) {
      ratings.total_ratings += 1;
      ratings.rates[rating.rate] += 1;
      ratings.avg_rating += rating.rate;
    }
  });

  if (ratings.total_ratings > 0) {
    ratings.avg_rating = ratings.avg_rating / ratings.total_ratings;
  }

  return ratings;
}

const getSingleAvgRating = (totalRating: number, singleRating: number) => {
  const ratingProgress = (singleRating / totalRating) * 100;
  return Number(ratingProgress.toFixed());
};

const CustomProgress = ({
  totalRating,
  singleRating,
  label,
}: {
  totalRating: number;
  singleRating: number;
  label: number;
}) => {
  const value = getSingleAvgRating(totalRating, singleRating);

  return (
    <div className="grid grid-cols-[30px_1fr] items-center gap-1">
      <p className="text-center text-black grid grid-cols-[15px_1fr] items-center justify-items-center  ">
        {label} <FillStarIcon />
      </p>
      <Progress value={value} size="md" />
    </div>
  );
};

export default function CustomerReviewCard({
  product,
}: {
  product: ProductDetailType;
}) {
  const dispatch = useDispatchContext();
  const ratings = calculateRatings((product?.ratings as RatingType[]) || []);
  return (
    <div className="rounded-lg bg-gray-200 p-5">
      <h2 className="text-black text-2xl not-italic font-bold mb-4">
        Customer Reviews
      </h2>
      <RatingCard avgRating={product.averageRating} />
      <p className="text-blue-900 text-sm not-italic font-normal leading-7 my-2 mb-3">
        {product.ratings?.length} Ratings
      </p>
      <div className="grid grid-cols-[1fr_max-content] gap-5">
        <div className="flex flex-col gap-2">
          <CustomProgress
            label={5}
            singleRating={ratings.rates?.[5]}
            totalRating={ratings.total_ratings}
          />
          <CustomProgress
            label={4}
            singleRating={ratings.rates[4]}
            totalRating={ratings.total_ratings}
          />
          <CustomProgress
            label={3}
            singleRating={ratings.rates[3]}
            totalRating={ratings.total_ratings}
          />
          <CustomProgress
            label={2}
            singleRating={ratings.rates[2]}
            totalRating={ratings.total_ratings}
          />
          <CustomProgress
            label={1}
            singleRating={ratings.rates[1]}
            totalRating={ratings.total_ratings}
          />
        </div>
      </div>
      <div className="w-full h-[2px] bg-gray-300 my-3"></div>
      <RatingPoints product={product} />
      <OutlinedButton
        label="Write a Review"
        className="mt-5"
        onClick={() => dispatch({ type: "REVIEW_MODAL_TOGGLE_ON" })}
      />
    </div>
  );
}

const RatingPoints = ({ product }: { product: ProductDetailType }) => {
  return (
    <div className="flex flex-col gap-3">
      <SingleCardRatingPoint value={product.averageTasteRate} label="Taste" />
      <SingleCardRatingPoint
        value={product.averageMixabilityRate}
        label="Mixability"
      />
      <SingleCardRatingPoint
        value={product.averageEfficacyRate}
        label="Efficacy"
      />
      <SingleCardRatingPoint
        value={product.averageValueForMoneyRate}
        label="Value for money"
      />
    </div>
  );
};

const SingleCardRatingPoint = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  const array = new Array(Math.trunc(value)).fill("1");

  return (
    <div className="grid grid-cols-2 gap-1">
      <p className="text-black text-xs not-italic font-medium">{label}</p>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex">
          <div className="flex gap-2">
            {array.map((a, i: number) => (
              <div key={i} className="scale-75">
                <StarIcon />
              </div>
            ))}
          </div>
        </div>
        <p className="text-black text-xs not-italic font-medium">{value}</p>
      </div>
    </div>
  );
};

const StartCard = () => {
  return (
    <div className="flex flex-col gap-2">
      <RatingPercent rating={5} ratingPercentage={49.5} />
      <RatingPercent rating={4} ratingPercentage={75} />
      <RatingPercent rating={3} ratingPercentage={35} />
      <RatingPercent rating={2} ratingPercentage={20} />
      <RatingPercent rating={1} ratingPercentage={5} />
    </div>
  );
};

const RatingPercent = ({
  rating,
  ratingPercentage,
}: {
  rating: number;
  ratingPercentage: number;
}) => {
  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-2">
        <p className="text-black text-right text-base not-italic font-normal">
          {rating}
        </p>
        <StarIcon />
      </div>
      <div className="flex-1 h-2 bg-red-200  rounded-lg">
        <div
          className={`linear-gradient-1 h-2 opacity-100 rounded-lg`}
          style={{ width: `${ratingPercentage}%` }}
        ></div>
      </div>
      <p className="text-black  text-base not-italic font-normal w-[36px] text-left">
        {ratingPercentage}%
      </p>
    </div>
  );
};

const RatingCard = ({ avgRating }: { avgRating: number }) => {
  const array = new Array(Math.trunc(avgRating)).fill("1");
  return (
    <div className="flex items-center gap-4">
      <p className="text-6xl not-italic font-bold text-gradient">{avgRating}</p>
      <div>
        <p className="text-gray-500 text-sm not-italic font-semibold leading-7">
          Overall rating
        </p>
        <div className="flex gap-2">
          {array.map((a, i: number) => (
            <StarIcon key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
