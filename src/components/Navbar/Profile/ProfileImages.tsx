import Image from "next/image";

export default function ProfileImages() {
  return (
    <div className="max-w-[1300px] mx-auto">
      <Image
        src={"/assets/footer/payment.png"}
        alt="footer"
        width={327}
        height={27}
      />
    </div>
  );
}
