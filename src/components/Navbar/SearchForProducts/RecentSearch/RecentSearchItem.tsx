import { CrossIcon, RecentIcon } from "@/Icons";

type Props = {
  searchItem: {
    searchKey: string;
    category: string;
  };
};
export default function RecentSearchItem({ searchItem }: Props) {
  return (
    <div className="flex items-center gap-5">
      <RecentIcon />
      <div>
        <p className="text-black text-sm not-italic font-medium">
          {searchItem?.searchKey}
        </p>
        <p className="text-sm not-italic font-medium opacity-40">
          {searchItem?.category}
        </p>
      </div>
      <button className="ml-auto">
        <CrossIcon />
      </button>
    </div>
  );
}
