import { FavIcon } from "@/Icons";
import Link from "next/link";

export default function Favourite() {
  return (
    <Link href={"/wishlist"}>
      <FavIcon />
    </Link>
  );
}
