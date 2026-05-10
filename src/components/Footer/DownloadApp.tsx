import Image from "next/image";

export default function DownloadApp() {
  return (
    <div className="rounded-lg bg-gray-100 py-3 px-5">
      <h3 className="text-blue-900 text-base not-italic font-normal leading-6 mb-3">
        Download Our App
      </h3>
      <div className="flex gap-3">
        <button className="flex-1">
          <Image
            src={"/assets/footer/googleplay.png"}
            alt="google play"
            width={121}
            height={36}
            className="w-full"
          />
        </button>
        <button className="flex-1">
          <Image
            src={"/assets/footer/applestore.png"}
            alt="google play"
            width={121}
            height={36}
            className="w-full"
          />
        </button>
      </div>
    </div>
  );
}
