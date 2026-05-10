import { ReactNode } from "react";

export default function ModalPopup({
  children,
  onclose,
}: {
  children: ReactNode;
  onclose: () => void;
}) {
  return (
    <div
      onClick={onclose}
      className="fixed top-0 left-0 bottom-0 right-0 bg-white-0 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 flex items-center justify-center z-[99]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="shadow-lg border rounded-lg p-4 pr-0"
      >
        {children}
      </div>
    </div>
  );
}
