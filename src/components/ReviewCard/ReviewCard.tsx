"use client";
import { DotsIcon, EmptyStartIcon, FillStarIcon } from "@/Icons";
import { useState } from "react";

type Props = {
  name: string;
  postedDate: string;
  rating: string;
  review: string;
  imgs?: string[];
};
export default function ReviewCard({
  name,
  postedDate,
  rating,
  review,
  imgs,
}: Props) {
  const [toggle, setToggle] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <p className="text-black text-sm not-italic font-bold">{name}</p>
          <p className="text-gray-600 not-italic font-medium text-[10px]">
            {postedDate}
          </p>
        </div>
        <div className="relative">
          <div className="cursor-pointer" onClick={() => setToggle(!toggle)}>
            <DotsIcon />
          </div>
          {toggle && (
            <div className="absolute top-full right-0 sm-1 bg-white z-20 px-3 py-1 rounded">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          )}
        </div>
      </div>
     <div className="mb-4 mt-1">
  <RatingStars rating={Number(rating)} />
</div>
      {imgs && (
        <div className="flex gap-3 mb-3">
          {imgs?.map((src, index) => (
            <img key={index} src={src} alt="product" className="w-[36px]" />
          ))}
        </div>
      )}
      <p className="text-black text-sm not-italic font-normal">{review}</p>
    </div>
  );
}

const RatingStars = ({ rating }: { rating: number }) => {
  const fillArr = new Array(rating).fill(null).map((_, index) => (
    <div key={index}>
      <FillStarIcon />
    </div>
  ));
  const emptyArr = new Array(5 - rating).fill(null).map((_, index) => (
    <div key={index}>
      <EmptyStartIcon />
    </div>
  ));
  return (
    <div className="flex items-center gap-1">
      {fillArr}
      {emptyArr}
    </div>
  );
};
