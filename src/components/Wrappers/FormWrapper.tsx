import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
  link?: {
    linkName: string;
    linkLabel: string;
    link: string;
  };
  privacy?: boolean;
};

export default function FormWrapper({ children, label, link, privacy }: Props) {
  return (
    <div className="w-full rounded-[24px] sm-1 flex flex-col py-6">
      <h2 className="text-black text-3xl not-italic font-semibold text-center mb-[38px]">
        {label}
      </h2>
      {children}
      {/* <div className="w-[170px] h-px relative bg-gray-300 mx-auto mb-[21px] mt-[44px] max-[500px]:mt-[70px]">
        <span className="absolute bg-white text-center text-xs not-italic font-normal leading-5 px-2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          Or
        </span>
      </div> */}
      <div className="flex gap-8 mx-auto mb-[40px]">
        {/* <Facebookbutton />
        <GoogleButton /> */}
      </div>
      {link && (
        <div className="flex gap-2 mx-auto">
          <p className="text-sm not-italic font-normal text-text-grey opacity-50">
            {link.linkName}
          </p>
          <Link className="text-sm not-italic font-normal" href={link.link}>
            {link.linkLabel}
          </Link>
        </div>
      )}
      {privacy && (
        <p className="text-center text-xs not-italic font-normal max-w-[400px] mx-auto">
          By Signing in, you agree to our{" "}
          <Link className="underline" href="/terms-of-services">
            Terms of Services
          </Link>
          <br />
          and{" "}
          <Link className="underline" href="/terms-of-services">
            Privacy Policy
          </Link>
        </p>
      )}
    </div>
  );
}
