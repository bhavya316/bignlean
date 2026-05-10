import CountdownTimer from "../CountdownTimer";

type Props = {
  label: string;
  showBtn?: boolean;
  btnLabel?: string;
  onClick?: () => void;
  expiryTime?: string | null;
};

export default function SectionHeader({
  label,
  showBtn,
  btnLabel,
  expiryTime,
  onClick,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex items-center gap-4">
        <p className="text-black text-xl not-italic font-semibold">{label}</p>
        {expiryTime && <CountdownTimer expiryTime={expiryTime} />}
      </div>
      {showBtn && (
        <button
          onClick={onClick}
          className="text-sm not-italic font-semibold text-gradient"
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
}
