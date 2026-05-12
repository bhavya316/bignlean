const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3002";

export function getMediaUrl(src?: string | null, fallback = "/placeholder-product.png") {
  const value = typeof src === "string" ? src.trim() : "";

  if (!value) return fallback;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${apiBaseUrl}${value}`;

  return value;
}

export function getFirstMediaUrl(
  sources: Array<string | null | undefined> | undefined,
  fallback = "/placeholder-product.png"
) {
  const source = sources?.find((item) => typeof item === "string" && item.trim());
  return getMediaUrl(source, fallback);
}
