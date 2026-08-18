"use client";
import React, { ReactNode } from "react";
 import { ToastContainer } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
type Props = {
  children: ReactNode;
};
export default function layout({ children }: Props) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
       <ToastContainer position="top-right" style={{ top: "24px", zIndex: 99999 }} />
      {children}
    </div>
  );
}
