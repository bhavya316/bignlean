export type FlavorOption =
  | number
  | string
  | {
      id?: number | string;
      name?: string | number;
      flavor?: string | number;
      label?: string | number;
      stock?: string | number;
      mrp?: string | number;
      price?: string | number;
      sellingPrice?: string | number;
      premiumPrice?: string | number;
    };

function getVariantFlavorOptions(variant: any): FlavorOption[] {
  return Array.isArray(variant?.flavors)
    ? variant.flavors
    : Array.isArray(variant?.flavour)
    ? variant.flavour
    : Array.isArray(variant?.flavor)
    ? variant.flavor
    : [];
}

export function getOptionLabel(option: unknown) {
  if (option === null || option === undefined) return "";
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }
  if (typeof option !== "object") return "";

  const optionData = option as {
    name?: string | number;
    flavor?: string | number;
    flavour?: string | number;
    label?: string | number;
    unit?: string | number;
    units?: string | number;
  };
  const label =
    optionData.name ??
    optionData.flavor ??
    optionData.flavour ??
    optionData.label ??
    optionData.unit ??
    optionData.units;
  return label === null || label === undefined ? "" : String(label);
}

export function getFlavorLabel(flavor: FlavorOption | null | undefined) {
  return getOptionLabel(flavor);
}

export function getVariantFlavors(variant: any): string[] {
  return getVariantFlavorOptions(variant).map(getFlavorLabel).filter(Boolean);
}

export function getFirstFlavorLabel(variant: any) {
  return getFlavorLabel(getVariantFlavorOptions(variant)[0]);
}

export function resolveVariantSelection(variant: any, selectedFlavor?: string) {
  if (!variant) return null;

  const flavorOptions = getVariantFlavorOptions(variant);

  const selectedFlavorData = flavorOptions.find(
    (flavor: FlavorOption) => getFlavorLabel(flavor) === selectedFlavor
  );

  if (!selectedFlavorData || typeof selectedFlavorData !== "object") {
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

export function getNumericPrice(value: unknown) {
  const price = Number(value);
  return Number.isFinite(price) ? price : 0;
}

export function getVariantMarketPrice(variant: any) {
  return getNumericPrice(variant?.mrp);
}

export function getVariantSellingPrice(variant: any) {
  return getNumericPrice(variant?.sellingPrice ?? variant?.price);
}

export function getVariantSavings(variant: any) {
  const marketPrice = getVariantMarketPrice(variant);
  const sellingPrice = getVariantSellingPrice(variant);
  return Math.max(marketPrice - sellingPrice, 0);
}

export function getVariantDiscountPercent(variant: any) {
  const marketPrice = getVariantMarketPrice(variant);
  const savings = getVariantSavings(variant);

  if (marketPrice <= 0 || savings <= 0) return 0;

  return (savings / marketPrice) * 100;
}
