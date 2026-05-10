type Props = {
  src: string;
  label: string;
};
export default function TrendingCard({ src, label }: Props) {
  return (
    <div className="cursor-pointer">
      <div className="rounded-lg bg-[#F7F7F7] p-3 flex items-center justify-center mb-2">
        <img src={src} alt="product" className="w-24 h-22" />
      </div>
      <p className="text-black text-center text-xs not-italic font-medium">
        {label}
      </p>
    </div>
  );
}
