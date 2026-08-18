import React from "react";
import BrandLogo from "@/Icons/BrandLogo";

export default function Loader() {
  return (
    <div className="w-full flex items-center justify-center p-10 h-screen">
      <div className="animate-pulse">
        <BrandLogo />
      </div>
    </div>
  );
}
