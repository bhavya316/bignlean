import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/Icons";
import Link from "next/link";

export default function FollowUs() {
  return (
    <div className="rounded-lg bg-gray-100 p-5">
      <h3 className="text-blue-900 text-base not-italic font-normal leading-6 mb-3">
        Follow us
      </h3>
      <div className="flex items-center gap-6">
        <Link href={"https://www.facebook.com/bignleanindia/photos/"}>
          <FacebookIcon />
        </Link>
        <Link href={"https://www.instagram.com/bignleancom?igsh=MXMxcnMwb3gya2w1ZA=="}>
          <InstagramIcon />
        </Link>
        <Link href={"https://youtube.com/@bignleancom?si=aNbfngVLUcT_qeXC"}>
          <YoutubeIcon />
        </Link>
        <Link href={"https://x.com/bignlean"}>
          <TwitterIcon />
        </Link>
      </div>
    </div>
  );
}
