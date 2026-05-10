export default function OverviewCard({ overview }: { overview: any }) {
  return (
    <div className="w-[650px] max-[650px]:w-full">
      <h2 className="text-black text-base not-italic font-bold mb-3">
        Overview
      </h2>
      <div className="border-[1px] p-4 rounded-lg border-gray-300">
        {/* Header with serving information */}
        <div className="flex justify-end items-center mb-3">
          {/* <p className="text-black text-xs not-italic font-semibold">
            Per 30.4 g of 74 servings contains*
          </p> */}
        </div>
        <div className="w-full h-[1px] bg-gray-200 mb-4"></div>
        
        {/* Overview content with improved styling */}
        <div className="flex flex-col">
          {overview?.map((item: any, index: number) => (
            <div 
              key={index} 
              className={`flex items-center justify-between py-2 w-full ${
                index !== overview.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="text-black w-full text-[15px] not-italic font-medium">
                {item?.nutrients}
              </div>
              <div className="text-black  w-full text-[15px] not-italic font-medium text-center">
                {item?.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
