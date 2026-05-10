import { ReactNode } from "react";
import LoadingSvg from "./LoadinButtonSvg";

type Props = {
  label: string;
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disable?: boolean;
  loading?: boolean;
};
export default function OutlinedButton({
  label,
  className,
  icon,
  onClick,
  disable,
  loading,
}: Props) {
  return (
    <button
      disabled={disable || loading}
      onClick={onClick}
      className={`flex justify-center border gap-2  min-w-[100px] min-h-[42px]  items-center  border-red-500 cursor-pointer py-2 px-5 text-center text-base not-italic font-medium text-gradient rounded-xl ${
        className || ""
      } ${disable ? "border-gray-300 cursor-not-allowed text-gray-300" : ""}`}
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
