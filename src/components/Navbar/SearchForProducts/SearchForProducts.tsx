"use client";
import Searchbar from "@/components/SearchBar/Searchbar";
import { useState } from "react";

export default function SearchForProducts() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="relative w-[438px] max-[500px]:w-full">
      <Searchbar
        setSearchValue={setSearchValue}
        className="w-full"
        label="products"
        value={searchValue}
      />
    </div>
  );
}
