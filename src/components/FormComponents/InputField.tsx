"use client";
type Props = {
  label?: string;
  type: "mobile" | "text" | "email" | "textarea" | "date";
  placeholder?: string;
  error?: string;
  className?: string;
  shadow?: true | false;
  inputClassName?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: (e: any) => void;
  disabled?: boolean;
};
export default function InputField({
  type,
  label,
  placeholder,
  error,
  className,
  shadow = true,
  inputClassName,
  onChange,
  value,
  name,
  required = false,
  disabled = false,
}: Props) {
  if (type === "textarea") {
    return (
      <label className={`flex flex-col ${className || ""}`}>
        {label && <span className="mb-2 text-sm font-medium text-[#222]">{label}</span>}
        <textarea
          onChange={onChange}
          value={value}
          name={name}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-[15px] outline-none p-3 resize-none text-sm not-italic font-normal disabled:bg-gray-100 disabled:text-gray-500 ${
            shadow ? `sm-3` : `border border-[#D9D9D9]`
          }`}
          rows={5}
        />
        {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
      </label>
    );
  }
  return (
    <label className={`flex flex-col ${className || ""}`}>
      {label && <span className="mb-2 text-sm font-medium text-[#222]">{label}</span>}
      {type === "mobile" ? (
        <div
          className={`w-full rounded-[15px] flex items-center bg-white ${
            shadow ? `sm-3` : `border border-[#D9D9D9]`
          } overflow-hidden`}
        >
          <span className="px-5 border-r border-gray-400 text-sm not-italic font-normal bg-white  ">
            +91
          </span>
          <input
            onChange={onChange}
            name={name}
            required={required}
            value={value}
            disabled={disabled}
            type="text"
            className="w-full outline-none p-5 text-sm not-italic font-normal disabled:bg-gray-100 disabled:text-gray-500"
            placeholder={placeholder}
            maxLength={10}
          />
        </div>
      ) : (
        <input
          type={type}
          onChange={onChange}
          name={name}
          required={required}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-[15px] outline-none p-5 text-sm not-italic font-normal disabled:bg-gray-100 disabled:text-gray-500 ${
            shadow ? `sm-3` : `border border-[#D9D9D9]`
          } ${inputClassName || ""}`}
        />
      )}
      {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </label>
  );
}
