export type FlavorOption =
  | string
  | {
      id?: number | string;
      name?: string;
      flavor?: string;
      label?: string;
      stock?: string | number;
      mrp?: string | number;
      price?: string | number;
      sellingPrice?: string | number;
      premiumPrice?: string | number;
    };

export function getFlavorLabel(flavor: FlavorOption) {
  if (typeof flavor === "string") return flavor;
  return flavor.name || flavor.flavor || flavor.label || "";
}

export function getVariantFlavors(variant: any): string[] {
  const flavors = Array.isArray(variant?.flavors)
    ? variant.flavors
    : Array.isArray(variant?.flavour)
    ? variant.flavour
    : Array.isArray(variant?.flavor)
    ? variant.flavor
    : [];

  return flavors.map(getFlavorLabel).filter(Boolean);
}

export function resolveVariantSelection(variant: any, selectedFlavor?: string) {
  if (!variant) return null;

  const flavorOptions = Array.isArray(variant?.flavors)
    ? variant.flavors
    : Array.isArray(variant?.flavour)
    ? variant.flavour
    : Array.isArray(variant?.flavor)
    ? variant.flavor
    : [];

  const selectedFlavorData = flavorOptions.find(
    (flavor: FlavorOption) => getFlavorLabel(flavor) === selectedFlavor
  );

  if (!selectedFlavorData || typeof selectedFlavorData === "string") {
    return variant;
  }

  return {
    ...variant,
    stock: selectedFlavorData.stock ?? variant.stock,
    mrp: selectedFlavorData.mrp ?? variant.mrp,
    sellingPrice:
      selectedFlavorData.sellingPrice ??
      selectedFlavorData.price ??
      variant.sellingPrice,
    premiumPrice: selectedFlavorData.premiumPrice ?? variant.premiumPrice,
  };
}
