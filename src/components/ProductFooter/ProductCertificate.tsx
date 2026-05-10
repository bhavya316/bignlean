import Link from "next/link";

export default function ProductCertificate({
  certificates,
}: {
  certificates: any;
}) {
  return (
    <div className="border-[1px] p-4 rounded-lg border-gray-300">
      <div className="flex items-center justify-between">
        <h3 className="text-black text-2xl not-italic font-bold mb-3">
          Certificates
        </h3>
        <Link href={"/app-certificates"}>See All</Link>
      </div>
      {/* <p className="text-black text-lg not-italic font-medium mb-6">
        Bright Commodties (Glanbia Performance Nutrition)
      </p> */}
      <div className="w-[85%] flex gap-[43px]">
        {certificates?.map((item: any, index: number) => (
          <div key={index} className="flex-1">
            <img src={item} alt="certu" className="w-full max-h-[400px] object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
