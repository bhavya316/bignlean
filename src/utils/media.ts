const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3002";

type MediaSource = string | string[] | null | undefined;

function getFirstSource(src?: MediaSource) {
  if (Array.isArray(src)) {
    const source = src.find((item) => typeof item === "string" && item.trim());
    return typeof source === "string" ? source.trim() : "";
  }

  return typeof src === "string" ? src.trim() : "";
}

export function getMediaUrl(src?: MediaSource, fallback = "/assets/product.png") {
  let value = getFirstSource(src);

  if (!value) return fallback;

  // Normalize legacy Synoventum URLs to current API Base URL
  if (value.includes("bignlean-api.synoventum.site")) {
    value = value.replace(/https?:\/\/bignlean-api\.synoventum\.site/g, apiBaseUrl);
    // Remove double slashes, e.g., apiBaseUrl//uploads -> apiBaseUrl/uploads
    value = value.replace(/([^:]\/)\/+/g, "$1");
  }

  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${apiBaseUrl}${value}`;

  return value;
}

export function getFirstMediaUrl(
  sources: MediaSource | Array<MediaSource> | undefined,
  fallback = "/assets/product.png"
) {
  const sourceList = Array.isArray(sources) ? sources : [sources];

  for (const source of sourceList) {
    const value = getFirstSource(source);
    if (value) return getMediaUrl(value, fallback);
  }

  return fallback;
}
