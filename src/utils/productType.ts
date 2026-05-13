export interface ProductDetailType {
  id: number;
  brandId: number;
  brandName: string;
  catId: number;
  subCatId: number;
  name: string;
  isBestSeller: boolean;
  isOnFlashSale: boolean;
  mrp?: string | number;
  sellingPrice?: string | number;
  price?: string | number;
  stock?: string | number;
  images: string[];
  overView: OverView[];
  details: Detail[];
  tables: Table[];
  information: Information[];
  certificates: string[];
  supplements: string[];
  brand: Brand;
  hit: number;
  varients: Varient[];
  createdAt: string;
  updatedAt: string;
  userRating: any[];
  averageRating: number;
  averageTasteRate: number;
  averageMixabilityRate: number;
  averageEfficacyRate: number;
  averageValueForMoneyRate: number;
  discountPercentage: any;
  totalRating: number;
  ratings?: RatingType[];
  expiry_date?: string;
  similerProduct?: any[];
  countryOfOrigin?: string;
  brandOriginCountry?: string | null;
  brandOriginCountryCode?: string | null;
  isVeg?: boolean | null;
}

export interface OverView {
  value: string;
  nutrients: string;
}

export interface Detail {
  body: string;
  heading: string;
}

export interface Table {
  table: Table2[];
  title: string;
}

export interface Table2 {
  for: string;
  value: string;
}

export interface Information {
  value: string;
  nutrients: string;
}

export interface Brand {
  body: string;
  heading: string;
}

export interface Varient {
  id: number;
  mrp: string;
  date: string;
  stock: string;
  units: string;
  flavor: string[];
  premiumPrice: string;
  sellingPrice: string;
}

export interface RatingType {
  id: number;
  user: User;
  product: number;
  images: any;
  rate: number;
  tasteRate: number;
  mixabilityRate: number;
  efficacyRate: number;
  valueForMoneyRate: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  image: any;
  name: any;
  phone: string;
  email: any;
  gender: any;
  bglCash: number;
  dob: any;
  height: any;
  weight: any;
  referCode: string;
  createdAt: string;
  updatedAt: string;
}
