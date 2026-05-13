import { CoinSmIcon, Info2Icon, InfoIcon } from "@/Icons";
import { useGEtPinCodeAvailability } from "@/queries/Product";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import OutlinedButton from "../Buttons/OutlinedButton";

export default function ProductDelivery({
  price,
  countryOfOrigin,
  countryCode,
}: {
  price: number;
  countryOfOrigin?: string;
  countryCode?: string;
}) {
  return (
    <div className="w-[85%] max-lg:w-full max-[450px]:w-full">
      <h2 className="text-black text-lg not-italic font-semibold mb-4">
        Delivery & Services
      </h2>
      <PinCodeCard price={price} />
      {/* <BigLeanCashCard /> */}
      <OriginCard country={countryOfOrigin || "India"} countryCode={countryCode} />
      {/* <MembershipCard /> */}
    </div>
  );
}
const MembershipCard = () => {
  return (
    <div className="flex items-center linear-gradient-1 rounded-lg overflow-hidden p-4 mt-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-white text-xs not-italic font-semibold leading-4">
            Premium Membership
          </p>
          <Info2Icon />
        </div>
        <p className="text-white text-xs not-italic font-normal leading-4">
          Save more with attractive deals using Premium Membership. Buy now at
          Rs. 499 for a year
        </p>
      </div>
      <button className="whitespace-nowrap bg-white p-2 rounded-lg text-black text-xs not-italic font-medium leading-4">
        + Add
      </button>
    </div>
  );
};

const COUNTRY_CODES: Record<string, string> = {
  india: "IN",
  bharat: "IN",
  "united states": "US",
  usa: "US",
  us: "US",
  "united kingdom": "GB",
  uk: "GB",
  england: "GB",
  canada: "CA",
  australia: "AU",
  "new zealand": "NZ",
  germany: "DE",
  france: "FR",
  italy: "IT",
  spain: "ES",
  netherlands: "NL",
  belgium: "BE",
  switzerland: "CH",
  sweden: "SE",
  norway: "NO",
  denmark: "DK",
  ireland: "IE",
  poland: "PL",
  austria: "AT",
  portugal: "PT",
  "united arab emirates": "AE",
  uae: "AE",
  "saudi arabia": "SA",
  qatar: "QA",
  kuwait: "KW",
  singapore: "SG",
  malaysia: "MY",
  thailand: "TH",
  indonesia: "ID",
  vietnam: "VN",
  philippines: "PH",
  china: "CN",
  japan: "JP",
  "south korea": "KR",
  korea: "KR",
  taiwan: "TW",
  "hong kong": "HK",
  brazil: "BR",
  mexico: "MX",
  "south africa": "ZA",
  turkey: "TR",
};

const getCountryCode = (country: string, countryCode?: string) => {
  const code = countryCode || COUNTRY_CODES[country.trim().toLowerCase()];
  return /^[A-Za-z]{2}$/.test(code || "") ? code.toLowerCase() : "in";
};

const OriginCard = ({
  country,
  countryCode,
}: {
  country: string;
  countryCode?: string;
}) => {
  const code = getCountryCode(country, countryCode);
  const flagSrc = code === "in"
    ? "/assets/product/india.png"
    : `https://flagcdn.com/w80/${code}.png`;

  return (
    <div className="flex items-center justify-around sm-3 rounded-lg p-4 mt-5">
      <div className="flex flex-col gap-2 items-center">
        <img src="/assets/product/fssai.png" alt="fssai" className="w-[48px]" />
        {/* <p className="text-black text-xs not-italic font-normal">
          Lic. No. 10015064000576
        </p> */}
      </div>
      <div className="w-[1px] h-[60px] bg-gray-200"></div>
      <div className="flex flex-col gap-2 items-center">
        <img
          src={flagSrc}
          alt={`${country} flag`}
          className="h-[28px] w-[42px] rounded-sm object-contain shadow-sm"
          onError={(event) => {
            event.currentTarget.src = "/assets/product/india.png";
          }}
        />
        <p className="text-black text-xs not-italic font-normal">
          Origin: {country}
        </p>
      </div>
    </div>
  );
};

const BigLeanCashCard = () => {
  return (
    <div className="flex items-center gap-2 bg-white p-4 rounded-lg mt-6 sm-3">
      <p className="text-sm not-italic font-medium text-gradient">
        You will earn
      </p>
      <CoinSmIcon />
      <p className="text-sm not-italic font-medium text-gradient">
        3 BignLean Cash on this order
      </p>
    </div>
  );
};

const PinCodeCard = ({ price }: { price: number }) => {
  const [pincode, setpincode] = useState("");
  const [pinCodeError, setPinCodeError] = useState(false);
  const { mutate, data, error, status } = useGEtPinCodeAvailability();
  const pincodeHandler = () => {
    if (pincode.length === 6) {
      setPinCodeError(false);
      mutate({ input: pincode, productPrice: price });
    } else {
      setPinCodeError(true);
    }
  };
  useEffect(() => {
    if (pincode.length === 0) {
      setPinCodeError(false);
    }
  }, [pincode]);

  return (
    <>
      <label className="sm-2 p-2 relative flex items-center justify-between bg-white rounded-lg">
        <input
          type="number"
          placeholder="enter pincode"
          required
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setpincode(e.target.value)
          }
          className="border-none outline-none grow"
        />

        <OutlinedButton
          disable={pincode.length < 6 ? true : false || status === "pending"}
          label="Check"
          loading={status === "pending"}
          onClick={pincodeHandler}
        />
        {pinCodeError && (
          <span className="absolute top-[-2px] left-2 text-red-600">
            Enter a valid pincode
          </span>
        )}
      </label>
      <div className="mt-4 flex flex-col gap-5">
        {data?.status && (
          <div className="flex items-center gap-3">
            <img
              src="/assets/track/completed.png"
              alt="complete"
              className="w-[22px] h-[22px]"
            />
            <p className="text-black text-sm not-italic font-normal">
              Delivery Available
            </p>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3">
            <img
              src="/assets/track/unavailable.png"
              alt="complete"
              className="w-[22px] h-[22px]"
            />
            <p className="text-black text-sm not-italic font-normal">
              Delivery Unavailable
            </p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <img src="/assets/product/cod.png" alt="truck" className="w-[22px]" />
          <p className="text-black text-sm not-italic font-normal">
            Cash on Delivery available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/assets/product/return.png"
            alt="truck"
            className="w-[22px]"
          />
          <p className="text-black text-sm not-italic font-normal flex items-center gap-2">
            14 Days return policy
            <Link
              href={"/return-policy"}
              className="text-black text-sm not-italic font-semibold text-gradient"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
