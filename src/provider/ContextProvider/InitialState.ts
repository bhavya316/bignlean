import { InitialState } from "@/utils/Types";

export const initialState: InitialState = {
  recentSearchToggle: false,
  notificationToggle: false,
  profileToggle: false,
  locationToggle: false,
  activeProductTab: "Overview",
  reviewModalToggle: false,
  slidePerView: 5,
  filterProductsParams: {
    discountPercent: "0",
    minRating: "0",
    "priceRanges[]": "0-99999",
  },
  selectedBrands: null,
  userData: null,
  compareProductId: null,
};
