"use client";
import { AddressIcon, CallIcon, MessageIcon } from "@/Icons";
import ContactUsForm from "@/components/Forms/ContactUsForm/ContactUsForm";
import CustomPageWrapper from "@/components/Wrappers/CustomPageWrapper";
import Image from "next/image";
import { ReactNode } from "react";

export default function page() {
  return (
    <CustomPageWrapper heading="Contact us">
      <div className="flex w-[1100px] mx-auto max-[1100px]:w-full gap-[80px] max-[1000px]:gap-[40px] mb-[170px] max-[550px]:mb-[70px]">
        <div className="flex-1">
          <ContactUsForm />
        </div>
        <div className=" w-[450px] max-[1000px]:w-[350px] max-[800px]:hidden">
          <Image
            src={"/assets/contact/img1.jpg"}
            alt="man drinking protien"
            width={100}
            height={100}
            className="w-full"
          />
        </div>
      </div>
      <div className="w-full custom-grid3">
        <AddressCard
          heading="Call"
          icon={<CallIcon />}
          para={["Mon-Sat : 10:00 AM - 7:00 PM", "Sunday - Holiday"]}
          subHeading="1800 266 1313"
        />
        <AddressCard
          icon={<MessageIcon />}
          heading="Bulk Order"
          para={["orders@bignlean.com"]}
        />
        <AddressCard
          icon={<MessageIcon />}
          heading="Feedback"
          para={["support@bignlean.com"]}
        />
        <AddressCard
          icon={<AddressIcon />}
          heading="Corporate Address"
          para={[
            "BIGNLEAN.COM Shop No. 16/17 Lodha Freshia Building E Wing Kalyan Shil Rd, Nilje Dombivali E-421204",
          ]}
        />
        <AddressCard
          icon={<AddressIcon />}
          heading="Branch Address"
          para={[
            "BIGNLEAN.COM Shop No. 6, Kalash Udyan, Plot No.21, Sector 11, Kopar Khairane New Mumbai Maharashtra 400709",
          ]}
        />
      </div>
    </CustomPageWrapper>
  );
}

type AddressProps = {
  icon: ReactNode;
  heading?: string;
  para?: string[];
  subHeading?: string;
};
const AddressCard = ({ icon, para, heading, subHeading }: AddressProps) => {
  return (
    <div className=" sm-3 flex flex-col items-center rounded-[10px] p-4 gap-1 text-center bg-white">
      {icon}
      {heading && (
        <h3 className="mt-1 text-black text-center text-lg not-italic font-bold leading-6 mb-1">
          {heading}
        </h3>
      )}
      {subHeading && (
        <h3 className="text-black text-base not-italic font-semibold leading-6 mb-1">
          {subHeading}
        </h3>
      )}
      <div>
        {para &&
          para.map((item, index) => (
            <p
              key={index}
              className="text-black text-sm not-italic font-medium leading-6"
            >
              {item}
            </p>
          ))}
      </div>
    </div>
  );
};
