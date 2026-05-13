"use client";
import { ApiPaths } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

async function getCartList(userId: number) {
  return axiosInstance({
    method: "GET",
    url: ApiPaths.CART_USER + "/" + userId,
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
  return axiosInstance({
    method: "GET",
    url: `/cart/details`,
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

async function addToCartList(payload: {
  user: number | string;
  product: number;
  qty: number;
  varientId: number;
  flavour: string;
  isCombo?: boolean;
}) {
  const { flavour, product, qty, user, varientId, isCombo } = payload;

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

  return axiosInstance({
    method: "POST",
    url: ApiPaths.CART,
    data: {
      user: userId,
      product,
      qty,
      flavour,
      varientId,
      isCombo: isCombo || false,
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
      isCombo?: boolean;
    }) => addToCartList(payload),
  });
}

async function removeFromCart(productId: number) {
  return axiosInstance({
    method: "DELETE",
    url: ApiPaths.CART + "/" + productId,
  });
}
async function updateQuantityFromCart(productId: number, qty: number) {
  return axiosInstance({
    method: "PUT",
    url: ApiPaths.CART + "/" + productId,
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
  return axiosInstance({
    method: "GET",
    url: ApiPaths.PRODUCTS + "/" + productId + "/" + userId,
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
  return axiosInstance({
    method: "GET",
    url: `/user/wallet/${userId}`,
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
  return axiosInstance({
    method: "GET",
    url: "/notifications",
  });
}

export function useGetNotificationList() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsList(),
  });
}
