type Props = {
  quote: string;
  authorName: string;
};
export default function Quotes({ authorName, quote }: Props) {
  return (
    <div className="w-[1200px] mx-auto rounded-xl max-[1200px]:w-full flex flex-col gap-2 items-center my-[40px] py-5 px-5 bg-white sm-2">
      <p className="text-black text-center text-base not-italic font-normal">
        {quote}
      </p>
      <p className="text-center text-xs not-italic font-bold text-gradient">
        -{authorName}
      </p>
    </div>
  );
}
