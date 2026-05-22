"use client";

import { getMediaUrl } from "@/utils/media";

type BannerMedia = string | string[] | null | undefined;

type BannerLike = {
  phone?: BannerMedia;
  tab?: BannerMedia;
  web?: BannerMedia;
  image?: BannerMedia;
  banner?: BannerMedia;
  name?: string;
  title?: string;
};

export function getBannerHref(link?: string | string[] | null) {
  if (Array.isArray(link)) {
    return link.find((item) => typeof item === "string" && item.trim()) || "#";
  }

  return typeof link === "string" && link.trim() ? link : "#";
}

export default function ResponsiveBannerImage({
  banner,
  alt = "Banner",
  className = "",
}: {
  banner: BannerLike;
  alt?: string;
  className?: string;
}) {
  const desktopSource = banner?.web || banner?.banner || banner?.image;
  const desktop = getMediaUrl(desktopSource, "/assets/product.png");
  const tablet = getMediaUrl(banner?.tab || desktopSource, desktop);
  const phone = getMediaUrl(banner?.phone || banner?.tab || desktopSource, tablet);

  return (
    <picture>
      <source media="(max-width: 640px)" srcSet={phone} />
      <source media="(max-width: 1024px)" srcSet={tablet} />
      <img
        src={desktop}
        alt={alt}
        className={className}
      />
    </picture>
  );
}
