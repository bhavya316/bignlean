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
        <Link href={"/facebook"}>
          <FacebookIcon />
        </Link>
        <Link href={"/instagram"}>
          <InstagramIcon />
        </Link>
        <Link href={"/linkedin"}>
          <LinkedinIcon />
        </Link>
        <Link href={"/youtube"}>
          <YoutubeIcon />
        </Link>
        <Link href={"/twitter"}>
          <TwitterIcon />
        </Link>
      </div>
    </div>
  );
}
