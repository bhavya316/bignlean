type Props = {
  src: string;
  label: string;
  subLabel: string;
  time: string;
};
export default function NotificationCard({
  src,
  label,
  subLabel,
  time,
}: Props) {
  return (
    <div className="flex gap-2 cursor-pointer items-center">
      <img
        src={src}
        alt="notification image"
        className="w-20 aspect-square max-md:w-14"
      />
      <div className="flex-1 flex flex-col px-3">
        <p className="text-lg not-italic font-medium">{label}</p>
        <p className="text-xs not-italic font-normal">{subLabel}</p>
        <p className="text-xs not-italic font-normal mt-auto">
          {new Intl.DateTimeFormat("en-IN", {
            dateStyle: "long",
          }).format(new Date(time))}
        </p>
      </div>
    </div>
  );
}
