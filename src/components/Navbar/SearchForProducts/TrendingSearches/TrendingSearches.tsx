"use client";
import { useEffect, useState } from "react";
import TrendingCard from "./TrendingCard";
import { API_CONFIG } from "@/config/api";

export default function TrendingSearches() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchTrendSearch = async () => {
      const data = await fetch(
        `${API_CONFIG.BASE_URL}/products/trending`
      ).then((data) => data.json());
      setData(data.trendingSearches);
    };
    fetchTrendSearch();
  }, []);
  if (data.length > 0) {
    return (
      <div className="max-w-full overflow-hidden">
        <h3 className="text-black text-lg not-italic font-semibold mb-4">
          Trending Searches
        </h3>
        <div className="flex gap-3 max-w-full overflow-x-scroll">
          {data?.map((item: any, index) => (
            <TrendingCard
              key={index}
              label={item?.name}
              src={item?.images[0]}
            />
          ))}
        </div>
      </div>
    );
  }
  return <></>;
}
