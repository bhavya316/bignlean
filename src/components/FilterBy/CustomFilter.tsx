"use client";
import { DownArrow } from "@/Icons";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useAppContext,
  useDispatchContext,
} from "@/provider/ContextProvider/ContextProvider";
import "./styles.css";
import { Radio, RadioGroup } from "@nextui-org/radio";
type Props = {
  heading?: string;
  filterOptions: string[];
  search?: boolean;
};
export default function CustomFilter({
  heading,
  filterOptions,
  search,
}: Props) {
  const [toggle, setToggle] = useState(false);
  const { selectedBrands: previousSelectedBrands } = useAppContext();

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    previousSelectedBrands ? [previousSelectedBrands.split("=")[1]] : []
  );
  const dispatch = useDispatchContext();

  const brandHandler = (e: ChangeEvent<HTMLInputElement>, brand: string) => {
    
    if (e.target.checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      const filterBrands = selectedBrands.filter(
        (allBrands) => allBrands !== brand
      );
      setSelectedBrands([...filterBrands]);
    }
  };

  useEffect(() => {
    if (selectedBrands) {
      const data = selectedBrands.map((brand) => `brands[]=${brand}`);
      if (data) {
        dispatch({ type: "SET_SELECTED_BRANDS", payload: data.join("&") });
      }
    }
  }, [selectedBrands]);

  return (
    <div className="border border-gray-300 cursor-pointer rounded-lg p-4 flex flex-col gap-3">
      {heading && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setToggle(!toggle);
          }}
          className="flex items-center justify-between max-[1400px]:gap-5"
        >
          <h2>{heading}</h2>
          {filterOptions?.length > 1 && (
            <button>
              <DownArrow />
            </button>
          )}
        </div>
      )}
      {(toggle || filterOptions?.length === 1) && (
        <>
          {/* {search && (
            <InputField
              type="text"
              shadow={false}
              placeholder={`Search ${heading}`}
              inputClassName="!p-3"
              className="mb-4"
            />
          )} */}
          <div className="flex flex-col ">
            {filterOptions?.map((filter, index) => (
              <label
                key={index}
                className="flex items-center py-2 gap-4 ml-2 cursor-pointer"
              >
                <input
                  onChange={(e) => {
                    e.stopPropagation();
                    brandHandler(e, filter);
                  }}
                  type="checkbox"
                  checked={selectedBrands.includes(filter) ? true : false}
                  className="scale-[1.7] custom-checkbox"
                />
                <span className="text-black text-base not-italic font-normal">
                  {filter}
                </span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CustomRadioFilter({
  heading,
  radioFilters,
  paramName,
}: {
  heading: string;
  radioFilters: any[];
  paramName: "discountPercent" | "minRating" | "priceRanges[]";
}) {
  const [toggle, setToggle] = useState(false);

  const dispatch = useDispatchContext();

  const { filterProductsParams } = useAppContext();
  const handleRadioChange = (event: any) => {
    dispatch({
      type: "SET_PRODUCT_FILTER_PARAMS",
      payload: { [paramName]: event.target.value?.trimStart() },
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-3">
      {heading && (
        <div
          onClick={() => setToggle(!toggle)}
          className="flex cursor-pointer items-center justify-between max-[1400px]:gap-5"
        >
          <h2>{heading}</h2>
          {radioFilters?.length > 1 && (
            <button>
              <DownArrow />
            </button>
          )}
        </div>
      )}
      {(toggle || radioFilters?.length === 1) && (
        <>
          <div className="flex flex-col gap-2">
            <RadioGroup isRequired={false}>
              {radioFilters?.map((filter: any, index: number) => (
                <Radio
                  key={index}
                  color="danger"
                  value={filter.value}
                  onChange={handleRadioChange}
                  checked={
                    String(filterProductsParams[paramName]) === filter.value
                  }
                >
                  {filter.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
}
