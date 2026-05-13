import { ApiPaths } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

async function getAllBrands() {
  const { data } = await axiosInstance.get(ApiPaths.BRANDS);
  return data;
}

async function getAllCategories() {
  const { data } = await axiosInstance.get(ApiPaths.CATEGORIES);
  return data;
}

async function getAllHomeProducts() {
  const { data } = await axiosInstance.get(ApiPaths.HOME);
  return data;
}

async function getAllProducts(params: any, selectedBrands: string) {
  const brands = selectedBrands ? `?${selectedBrands}` : "";
  const { data } = await axiosInstance.get(ApiPaths.ALL_PRODUCTS + brands, { params });
  return data;
}

async function getAllBlogs() {
  const { data } = await axiosInstance.get(ApiPaths.BLOGS);
  return data;
}

async function getAllOffers() {
  const { data } = await axiosInstance.get("/offers");
  return data;
}

async function getBestSellers() {
  const data = await axiosInstance({
    method: "GET",
    url: ApiPaths.BEST_SELLERS,
  });
  return data.data;
}

// React Query Hooks
export function useGetAllCategories() {
  return useQuery({
    queryKey: ["all-Categories"],
    queryFn: () => getAllCategories(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetAllHomeProducts() {
  return useQuery({
    queryKey: ["all-HomeProducts"],
    queryFn: () => getAllHomeProducts(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetAllProducts(params: any, selectedBrands?: string) {
  return useQuery({
    queryKey: ["all-Products", params, selectedBrands],
    queryFn: () => getAllProducts(params, selectedBrands as string),
    enabled: true,
  });
}

export function useGetAllBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () => getAllBlogs(),
    refetchOnWindowFocus: false,
  });
}

export function useGetAllOffers() {
  return useQuery({
    queryKey: ["all-offers"],
    queryFn: () => getAllOffers(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetBestSellers() {
  return useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => getBestSellers(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export {
  getAllBrands,
  getAllCategories,
  getAllHomeProducts,
  getAllProducts,
  getAllBlogs,
  getAllOffers,
  getBestSellers,
  getComboCategories,
  getComboProductDetail,
};

export function useGetAllBrands() {
  return useQuery({
    queryKey: ["all-brands"],
    queryFn: () => getAllBrands(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
async function getPopularBrands() {
  const data = await axiosInstance({
    method: "GET",
    url: "/topBrands",
  });
  return data.data;
}
export function useGetPopularBrands() {
  return useQuery({
    queryKey: ["popular-brands"],
    queryFn: () => getPopularBrands(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
async function getAllBanners() {
  const data = await axiosInstance({
    method: "GET",
    url: ApiPaths.BANNERS,
  });
  return data.data;
}
export function useGetAllBanners() {
  return useQuery({
    queryKey: ["all-Banners"],
    queryFn: () => getAllBanners(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

async function getUserReviews(userId: number) {
  const data = await axiosInstance({
    method: "GET",
    url: `/ratings/${userId}`,
  });
  return data.data;
}

export function useGetUserReviews(userId: number) {
  return useQuery({
    queryKey: ["user-reviews"],
    queryFn: () => getUserReviews(userId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
}

async function getUserLocation(lat: number, lang: number) {
  const apiKey = process?.env?.NEXT_PUBLIC_GEOCODING;
  const data = await axiosInstance({
    method: "GET",
    url: `https://us1.locationiq.com/v1/reverse?lat=${lat}&lon=${lang}&format=json&key=${apiKey}`,
  });
  return data.data;
}
export function useGetUserLocation(cords: { lat: number; lang: number }) {
  return useQuery({
    queryKey: ["user-location", cords],
    queryFn: () => getUserLocation(cords?.lat, cords?.lang),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!cords,
  });
}

async function getOfferProducts(id: number) {
  const data = await axiosInstance({
    method: "GET",
    url: "/offers/" + id,
  });
  return data.data;
}
export function useGetOfferProducts(id: number) {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => getOfferProducts(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
async function getComboProducts(id: number) {
  const data = await axiosInstance({
    method: "GET",
    url: `/admin/combo-products/category/${id}`,
  });
  return {
    ...data.data,
    combo: data.data?.comboProducts || data.data?.products || data.data?.combo || [],
  };
}
export function useGetComboProducts(id: number) {
  return useQuery({
    queryKey: ["combo", id],
    queryFn: () => getComboProducts(id),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
}

export interface Offer {
  id: number;
  name: string;
  image: string;
  banner?: string;
  logo?: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  catId: number;
  subCatId: number;
  name: string;
  isBestSeller: boolean;
  isOnFlashSale: boolean;
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
  discountPercentage: number;
  totalRating: number;
  ratings: any[];
  myRating: any[];
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

// Lines 215-240: Related Products functions
async function getRelatedProducts(brandId: string | null) {
  if (!brandId) return { products: [] };
  
  try {
    const data = await axiosInstance({
      method: "GET",
      url: `${ApiPaths.ALL_PRODUCTS}`, // Using ALL_PRODUCTS constant
      params: {
        brandId, // Use brandId as query parameter
        limit: 3,  // Only get 3 products
        page: 1    // First page
      }
    });
    
    return data.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return { products: [] };
  }
}

export function useGetRelatedProducts(brandId: string | null) {
  return useQuery({
    queryKey: ["related-products", brandId],
    queryFn: () => getRelatedProducts(brandId),
    enabled: !!brandId, // Only run if brandId exists
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

async function getRecentViews(userId: number) {
  const data = await axiosInstance({
    method: "GET",
    url: `${ApiPaths.RECENT_VIEWS}?userId=${userId}`,
  });
  return data.data;
}

export function useGetRecentViews(userId: number) {
  return useQuery({
    queryKey: ["recent-views", userId],
    queryFn: () => getRecentViews(userId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
}

async function getComboCategories() {
  const { data } = await axiosInstance.get(ApiPaths.COMBO_CATEGORIES);
  return data;
}

export function useGetComboCategories() {
  return useQuery({
    queryKey: ["combo-categories"],
    queryFn: () => getComboCategories(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

async function getComboProductDetail(id: number) {
  const { data } = await axiosInstance.get(`${ApiPaths.COMBO_PRODUCT}/${id}`);
  return data;
}

export function useGetComboProductDetail(id: number) {
  return useQuery({
    queryKey: ["combo-product", id],
    queryFn: () => getComboProductDetail(id),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
}

async function getPickOfTheDayProducts() {
  const data = await axiosInstance({
    method: "GET",
    url: "/admin/best-selling-products-today",
  });
  return data.data;
}

export function useGetPickOfTheDayProducts() {
  return useQuery({
    queryKey: ["pick-of-the-day"],
    queryFn: () => getPickOfTheDayProducts(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
