import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  heading?: string;
  className?: string;
  showContentFooter?: boolean;
  headingClass?: string;
};
export default function CustomPageWrapper({
  children,
  heading,
  className,
  headingClass,
}: Props) {
  return (
    <div
      className={`w-[1200px] max-[1200px]:w-full max-[850px]:pt-0 mx-auto py-[40px] px-[10px] ${className}`}
    >
      {heading && (
        <h2
          className={`text-black text-2xl not-italic font-bold leading-9 mb-7 max-[850px]:mb-4 ${headingClass}`}
        >
          {heading}
        </h2>
      )}
      {children}
    </div>
  );
}
