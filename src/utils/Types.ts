export type InitialState = {
  recentSearchToggle: boolean;
  notificationToggle: boolean;
  profileToggle: boolean;
  locationToggle: boolean;
  activeProductTab: string;
  reviewModalToggle: boolean;
  slidePerView: number;
  filterProductsParams: FilterProductsParamsType;
  userData: UserType | null;
  selectedBrands: string | null;
  compareProductId: number | null;
};

export type Action =
  | {
    type: "RECENT_SEARCH_TOGGLE_ON";
  }
  | {
    type: "SET_SELECTED_BRANDS";
    payload: string | null;
  }
  | {
    type: "RECENT_SEARCH_TOGGLE_OFF";
  }
  | {
    type: "NOTIFICATION_TOGGLE_ON";
  }
  | {
    type: "NOTIFICATION_TOGGLE_OFF";
  }
  | {
    type: "PROFILE_TOGGLE_ON";
  }
  | {
    type: "PROFILE_TOGGLE_OFF";
  }
  | {
    type: "LOCATION_TOGGLE_ON";
  }
  | {
    type: "LOCATION_TOGGLE_OFF";
  }
  | {
    type: "ACTIVE_PRODUCT_TAB";
    payload: string;
  }
  | {
    type: "REVIEW_MODAL_TOGGLE_ON";
  }
  | {
    type: "REVIEW_MODAL_TOGGLE_OFF";
  }
  | {
    type: "SET_SLIDE_PER_VIEW";
    payload: number;
  }
  | {
    type: "SET_PRODUCT_FILTER_PARAMS";
    payload: FilterParam;
  }
  | {
    type: "SET_USER_DATA";
    payload: UserType;
  }
  | {
    type: "SET_COMPARE_PRODUCT";
    payload: number | null;
  };

export type FilterParam = Partial<Record<ParamsKeys, string>>;
type ParamsKeys = "discountPercent" | "minRating" | "priceRanges[]";

type FilterProductsParamsType = {
  discountPercent: string;
  minRating: string;
  "priceRanges[]": string;
};
// type UserType = {
//   id: number;
//   image: null;
//   name: string;
//   phone: string;
//   email: string;
//   gender: string;
//   bglCash: number;
//   dob: string;
//   height: number;
//   weight: number;
//   referCode: string;
// };

export interface ProductDataType {
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
  isCombo?: boolean;
  isLegacyComboProduct?: boolean;
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
  averageRating: number;
  discountPercentage: any;
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

export type UserType = {
  id: number;
  image: null | string;  // Allow both null and string types
  name: string;
  phone: string;
  email: string;
  gender: string;
  bglCash: number;
  dob: string;
  height: number;
  weight: number;
  referCode: string;
};
