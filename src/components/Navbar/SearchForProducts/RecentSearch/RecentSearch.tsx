import RecentSearchItem from "./RecentSearchItem";

type RecentSearchList = {
  searchKey: string;
  category: string;
};
const recentSearchList: RecentSearchList[] = [
  {
    searchKey: "MuscleBlaze",
    category: "In all categories",
  },
  {
    searchKey: "Whey Proteins",
    category: "In all categories",
  },
  {
    searchKey: "TrueBasics",
    category: "In all categories",
  },
  {
    searchKey: "Creatine",
    category: "In all categories",
  },
  {
    searchKey: "Mass Gainers",
    category: "In all categories",
  },
];

export default function RecentSearch() {
  return (
    <div className="flex flex-col gap-4">
      {recentSearchList?.map((searchItem) => (
        <RecentSearchItem key={searchItem.searchKey} searchItem={searchItem} />
      ))}
    </div>
  );
}
