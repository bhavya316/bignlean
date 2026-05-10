import React from "react";
import "./style.css";

export default function Loader() {
  return (
    <div className="w-full flex items-center justify-center p-10 h-[200px]">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
