"use client";
import { ApiPaths } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_CONFIG } from "@/config/api";

async function getCartList(userId: number) {
  return axios({
    method: "GET",
    url: API_CONFIG.BASE_URL + ApiPaths.CART_USER + "/" + userId,
  });
}

export function useGetCartList(userId: number) {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCartList(userId),
    enabled: !!userId,
  });
}

async function getCartPrice(payload: {
  user: number | undefined;
  coupon: string;
  addressId: number;
}) {
  return axios({
    method: "GET",
    url: API_CONFIG.BASE_URL + `/cart/details`,
    params: {
      ...payload,
    },
  });
}

export function useGetCartPrice(payload: {
  user: number | undefined;
  coupon: string;
  addressId: number;
}) {
  return useQuery({
    queryKey: ["cart-price", payload],
    queryFn: () => getCartPrice(payload),
    enabled: !!payload.user,
  });
}

// async function addToCartList(payload: {
//   user: number;
//   product: number;
//   qty: number;
//   varientId: number;
//   flavour: string;
// }) {
//   const { flavour, product, qty, user, varientId } = payload;
//   return axios({
//     method: "POST",
//     url: base_url + ApiPaths.CART,
//     data: { user, product, qty, flavour, varientId },
//   });
// }

async function addToCartList(payload: {
  user: number | string;
  product: number;
  qty: number;
  varientId: number;
  flavour: string;
}) {
  const { flavour, product, qty, user, varientId } = payload;

  // Handle different user ID formats
  let userId = user;

  // If user is a string that contains non-numeric characters
  if (typeof user === 'string' && isNaN(Number(user))) {
    // Generate a stable numeric ID from the string - use timestamp hash
    const numericId = generateNumericIdFromString(user);
    userId = numericId;
  } else if (typeof user === 'string') {
    // If it's a numeric string, convert properly
    userId = Number(user);
  }

  console.log("Adding to cart with user ID:", userId, "Type:", typeof userId);

  return axios({
    method: "POST",
    url: API_CONFIG.BASE_URL + ApiPaths.CART,
    data: {
      user: userId,
      product,
      qty,
      flavour,
      varientId
    },
  });
}

// Function to generate a stable numeric ID from a string
function generateNumericIdFromString(str: string): number {
  // Simple hash function to generate a numeric value from a string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Ensure it's positive and within a reasonable INTEGER range for most DBs
  return Math.abs(hash) % 1000000000;
}

export function useAddToCartList() {
  return useMutation({
    mutationFn: (payload: {
      user: number;
      product: number;
      qty: number;
      varientId: number;
      flavour: string;
    }) => addToCartList(payload),
  });
}

async function removeFromCart(productId: number) {
  return axios({
    method: "DELETE",
    url: API_CONFIG.BASE_URL + ApiPaths.CART + "/" + productId,
  });
}
async function updateQuantityFromCart(productId: number, qty: number) {
  return axios({
    method: "PUT",
    url: API_CONFIG.BASE_URL + ApiPaths.CART + "/" + productId,
    data: { qty },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-price"] });
    },
  });
}

export function useUpdateQuantityFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: number; qty: number }) =>
      updateQuantityFromCart(payload?.productId, payload?.qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-price"] });
    },
  });
}

async function getProductDetail(productId: number, userId: number) {
  return axios({
    method: "GET",
    url: API_CONFIG.BASE_URL + ApiPaths.PRODUCTS + "/" + productId + "/" + userId,
  });
}

export function useGetProductDetail(productId: number, userId: number) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetail(productId, userId),
    enabled: !!productId,
  });
}

async function getWalletDetail(userId: number) {
  return axios({
    method: "GET",
    url: API_CONFIG.BASE_URL + `/user/wallet/${userId}`,
  });
}

export function useGetWalletDetail(userId: number) {
  return useQuery({
    queryKey: ["wallet-details"],
    queryFn: () => getWalletDetail(userId),
    enabled: !!userId,
  });
}

async function getNotificationsList() {
  return axios({
    method: "GET",
    url: API_CONFIG.BASE_URL + "/notifications",
  });
}

export function useGetNotificationList() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsList(),
  });
}
