import { ReactNode } from "react";
import LoadingSvg from "./LoadinButtonSvg";

type Props = {
  label: string;
  className?: string;
  icon?: ReactNode;
  disable?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export default function PrimaryButton({
  label,
  className,
  icon,
  onClick,
  loading,
  disable,
  type = "button",
}: Props) {
  return (
    <button
      disabled={disable || loading}
      onClick={onClick}
      type={type}
      className={`flex justify-center gap-2 min-w-[100px] cursor-pointer items-center py-3 px-5 max-lg:py-2 text-center text-base not-italic font-medium text-white disabled:cursor-not-allowed rounded-xl linear-gradient-1 ${
        className || ""
      }`}
    >
      {loading ? (
        <LoadingSvg />
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}
