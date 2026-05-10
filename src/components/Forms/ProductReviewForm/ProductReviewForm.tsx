"use client";

import { CrossIcon, StarIcon } from "@/Icons";
import LoadingSvg from "@/components/Buttons/LoadinButtonSvg";
import InputField from "@/components/FormComponents/InputField";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import { useGiveRating } from "@/queries/Rating";
import { useUploadPhoto } from "@/queries/Upload";
import { ProductDetailType } from "@/utils/productType";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ProductReviewForm({
  product,
}: {
  product: ProductDetailType;
}) {
  const queryClient = useQueryClient();
  const { userData } = useAppContext();
  const [formData, setFormData] = useState({
    product: product?.id,
    rate: 0,
    review: "",
  });
  const [images, setImages] = useState<File | null>(null);
  const { mutate: uploadPhoto } = useUploadPhoto();
  const { mutate: giveRating, isPending } = useGiveRating();
  const dispatch = useDispatchContext();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (images) {
      const data = new FormData();
      data.append("file", images);
      uploadPhoto(data as any, {
        onSuccess: (res) => {
          giveRating(
            {
              data: { ...formData, images: [res?.data?.fileUrl] },
              userId: userData?.id as number,
            },
            {
              onSuccess: () => {
                dispatch({ type: "REVIEW_MODAL_TOGGLE_OFF" });
                queryClient.invalidateQueries({ queryKey: ["product"] });
                toast.success("Review added Successfully!!!");
              },
              onError: () => {
                toast.error("Something went wrong!!!");
              },
            }
          );
        },
      });
    } else {
      giveRating(
        {
          data: { ...formData },
          userId: userData?.id as number,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product"] });
            dispatch({ type: "REVIEW_MODAL_TOGGLE_OFF" });
            toast.success("Review added Successfully!!!");
          },
          onError: () => {
            toast.error("Something went wrong!!!");
          },
        }
      );
    }
  };

  return (
    <div className="p-4 max-h-[70vh] min-w-[50vw] overflow-auto">
      <div className="p-4 h-full w-full overflow-auto">
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-black text-xl flex-1 not-italic font-semibold mb-4">
            Write a review
          </h2>
          <div
            className="cursor-pointer"
            onClick={() => dispatch({ type: "REVIEW_MODAL_TOGGLE_OFF" })}
          >
            <CrossIcon />
          </div>
        </div>
        <div className="flex gap-5">
          <img
            src={product.images?.[0]}
            alt="product"
            className="w-20 h-24 rounded object-contain"
          />
          <div>
            <p className="text-black text-sm not-italic font-medium">
              {product.name}
            </p>
            <RatingForm label="rate" title="Rate" setFormData={setFormData} />
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          <RatingForm
            title="Taste"
            label="tasteRate"
            setFormData={setFormData}
          />
          <RatingForm
            title="Mixability"
            label="mixabilityRate"
            setFormData={setFormData}
          />
          <RatingForm
            title="Efficacy"
            label="efficacyRate"
            setFormData={setFormData}
          />
          <RatingForm
            title="Value for Money"
            label="valueForMoneyRate"
            setFormData={setFormData}
          />
        </div>
        <div className="h-[2px] bg-gray-200 my-5"></div>
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-black text-lg not-italic font-semibold mb-2">
              Add a title
            </h3>
            <p className="text-black text-base not-italic font-normal mb-2">
              Write a review about the product
            </p>
            <InputField
              type="text"
              required
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Whats most important to know?"
              shadow={false}
            />
          </div>
          <label className="w-[100px] h-[100px] border border-dashed border-gray-300 rounded-lg cursor-pointer flex items-center justify-center">
            {images ? (
              <img
                src={URL.createObjectURL(images)}
                alt="img"
                className="w-full h-full"
              />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.4">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V12.449L19.7535 10.9786C18.019 9.84327 15.7486 9.96391 14.1442 11.2766L8.906 15.5624C7.80825 16.4606 6.25482 16.5431 5.06808 15.7663L2 13.7581V6ZM18.932 12.2336L22 14.2418V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V15.5509L4.24659 17.0214C5.98106 18.1567 8.25145 18.036 9.85585 16.7233L15.0941 12.4375C16.1918 11.5394 17.7452 11.4568 18.932 12.2336ZM8.5 11C9.88071 11 11 9.88071 11 8.5C11 7.11929 9.88071 6 8.5 6C7.11929 6 6 7.11929 6 8.5C6 9.88071 7.11929 11 8.5 11Z"
                    fill="black"
                  />
                </g>
              </svg>
            )}
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                //@ts-ignore
                setImages(e.target.files[0]);
              }}
            />
          </label>

          <div>
            <h3 className="text-black text-lg not-italic font-semibold mb-2">
              Add a review
            </h3>
            <InputField
              value={formData?.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              type="textarea"
              placeholder="What did you like about the product? What did you use this Product for ?"
              shadow={false}
            />
          </div>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isPending}
          className={`flex justify-center gap-2 min-w-[100px] cursor-pointer items-center py-3 px-5 max-lg:py-2 text-center text-base not-italic font-medium text-white disabled:cursor-not-allowed rounded-xl linear-gradient-1 `}
        >
          {isPending ? <LoadingSvg /> : <>Submit </>}
        </button>
      </div>
    </div>
  );
}

const RatingForm = ({
  label,
  title,
  setFormData,
}: {
  label?: string;
  title?: string;
  setFormData?: any;
}) => {
  const [star, setStar] = useState(0);
  return (
    <div>
      {label && (
        <p className="text-black capitalize text-lg not-italic font-medium mb-2">
          {title}
        </p>
      )}
      <div className="flex items-center gap-2">
        {new Array(5).fill(null).map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setStar(index + 1);
              setFormData((prev: any) => ({
                ...prev,
                [`${label}`]: index + 1,
              }));
            }}
          >
            {index + 1 <= star ? <StarIcon /> : <EmptyStar />}
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyStar = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.06194 1.50576C9.85672 -0.168584 12.1433 -0.168587 12.9381 1.50576L14.4678 4.7285C14.8536 5.54128 15.602 6.10935 16.4732 6.24097L19.8939 6.75776C21.658 7.02427 22.3888 9.2988 21.0907 10.6144L18.6155 13.123C17.9893 13.7575 17.7058 14.6689 17.8527 15.56L18.4371 19.1021C18.745 20.9687 16.87 22.3438 15.3024 21.4869L12.2428 19.8145C11.4651 19.3894 10.5349 19.3894 9.75718 19.8145L6.69763 21.4869C5.12996 22.3438 3.25501 20.9687 3.56293 19.1021L4.14725 15.56C4.29425 14.6689 4.0107 13.7575 3.38455 13.123L0.909318 10.6144C-0.388808 9.2988 0.341973 7.02427 2.10607 6.75776L5.52676 6.24097C6.39795 6.10935 7.14635 5.54128 7.53217 4.7285L9.06194 1.50576Z"
        stroke="black"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};
